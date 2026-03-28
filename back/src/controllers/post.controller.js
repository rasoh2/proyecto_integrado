const { Op } = require("sequelize");
const { Post, Category, User, sequelize } = require("../models");

const mapPostResponse = (post) => ({
  id: post.id,
  title: post.title,
  content: post.content,
  published: post.published,
  author: post.author,
  categories: post.categories,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
});

const getAllPosts = async (req, res) => {
  try {
    const { search, published, category } = req.query;
    const where = {};

    if (typeof published !== "undefined") {
      where.published = published === "true";
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    const include = [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "email"],
      },
      {
        model: Category,
        as: "categories",
        through: { attributes: [] },
      },
    ];

    if (category) {
      include[1].where = {
        name: {
          [Op.like]: `%${category}%`,
        },
      };
    }

    // Usar paginación desde middleware
    const { limit, offset, sort } = req.pagination || {
      limit: 10,
      offset: 0,
      sort: ["createdAt", "DESC"],
    };

    const { count, rows } = await Post.findAndCountAll({
      where,
      include,
      order: [sort],
      limit,
      offset,
    });

    return res.status(200).json({
      status: "success",
      message: "Posts obtenidos correctamente",
      data: rows.map(mapPostResponse),
      pagination: {
        total: count,
        page: req.pagination?.page || 1,
        pages: Math.ceil(count / limit),
        limit,
      },
      count: rows.length,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener posts",
      data: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: `Post con ID ${id} no encontrado`,
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Post obtenido correctamente",
      data: mapPostResponse(post),
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener post",
      data: error.message,
    });
  }
};

const createPost = async (req, res) => {
  // Crear transacción fuera del try-catch para control manual
  const transaction = await sequelize.transaction();

  try {
    const { title, content, published, categories } = req.body;

    if (!title || !content) {
      await transaction.rollback();
      return res.status(400).json({
        status: "error",
        message: "Titulo y contenido son requeridos",
        data: null,
      });
    }

    // === OPERACIÓN 1: Crear el post dentro de la transacción ===
    const post = await Post.create(
      {
        title,
        content,
        published: Boolean(published),
        userId: req.user.id,
      },
      { transaction },
    );

    // === OPERACIÓN 2: Asociar categorías (si existen) ===
    if (Array.isArray(categories) && categories.length > 0) {
      const categoryInstances = await Promise.all(
        categories.map((name) =>
          Category.findOrCreate({
            where: { name: String(name).trim() },
            transaction, // Usar la misma transacción
          }).then(([categoryInstance]) => categoryInstance),
        ),
      );

      // Asociar categorías al post dentro de la misma transacción
      await post.setCategories(categoryInstances, { transaction });
    }

    // ✅ Todo salió bien: confirmar la transacción
    await transaction.commit();

    // Recuperar el post completo con relaciones
    const savedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json({
      status: "success",
      message: "Post y categorías creados correctamente en transacción",
      data: mapPostResponse(savedPost),
    });
  } catch (error) {
    // ❌ Algo salió mal: deshacer TODAS las operaciones (ROLLBACK)
    await transaction.rollback();

    console.error("Error al crear post (ROLLBACK ejecutado):", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Error de validacion",
        data: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error al crear post. Transacción cancelada.",
      data: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, published, categories } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: `Post con ID ${id} no encontrado`,
        data: null,
      });
    }

    if (post.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para modificar este post",
        data: null,
      });
    }

    await post.update({
      title: title ?? post.title,
      content: content ?? post.content,
      published: typeof published === "boolean" ? published : post.published,
    });

    if (Array.isArray(categories)) {
      const categoryInstances = await Promise.all(
        categories.map((name) =>
          Category.findOrCreate({
            where: { name: String(name).trim() },
          }).then(([categoryInstance]) => categoryInstance),
        ),
      );

      await post.setCategories(categoryInstances);
    }

    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          as: "categories",
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Post actualizado correctamente",
      data: mapPostResponse(updatedPost),
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        status: "error",
        message: "Error de validacion",
        data: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error al actualizar post",
      data: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: `Post con ID ${id} no encontrado`,
        data: null,
      });
    }

    if (post.userId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "No tienes permisos para eliminar este post",
        data: null,
      });
    }

    await post.destroy();

    return res.status(200).json({
      status: "success",
      message: "Post eliminado correctamente",
      data: { id: Number(id) },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al eliminar post",
      data: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
