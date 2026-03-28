const jwt = require("jsonwebtoken");
const { User } = require("../models");

/**
 * Función auxiliar para generar el Token JWT
 * NOTA PARA JUNIOR:
 * Un JWT (JSON Web Token) es como una credencial o pase VIP.
 * Lo generamos con la información más básica del usuario y lo firmamos con 'JWT_SECRET'.
 * Así, el cliente podrá usar este token en sus próximas peticiones y sabremos quién es sin pedirle la contraseña de nuevo.
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },
  );
};

/**
 * Registrar un nuevo usuario (Sign Up)
 *
 * NOTA PARA JUNIOR:
 * Esta función es parecida a 'createUser' pero específicamente para la ruta pública de registro web.
 * Extraemos los datos del 'body', usamos Sequelize para guardar en la BD,
 * y muy importante, al crear devolvemos el 'Token' de una vez para que inicie sesión automáticamente.
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Nombre, email y contrasena son requeridos",
        data: null,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      // Forzamos a que todo nuevo registro libre sea 'user'
      role: "user",
    });

    const token = generateToken(user);

    return res.status(201).json({
      status: "success",
      message: "Usuario registrado correctamente",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Error de validacion",
        data: error.errors.map((e) => e.message),
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Error al registrar usuario",
      data: error.message,
    });
  }
};

/**
 * Iniciar sesión (Login / Sign In)
 *
 * NOTA PARA JUNIOR:
 * Aquí verificamos si la persona que entró envió los datos correctos (credenciales).
 * Buscamos el correo en la Base de Datos.
 * Importante: En Sequelize, la contraseña normalmente está protegida,
 * por eso usamos 'scope("withPassword")' para que nos traiga la contraseña real en texto plano
 * y así el backend la compare con la que me envió el usuario a través de un Hash con bcrypt (validatePassword).
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email y contrasena son requeridos",
        data: null,
      });
    }

    const user = await User.scope("withPassword").findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales invalidas",
        data: null,
      });
    }

    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Credenciales invalidas",
        data: null,
      });
    }

    const token = generateToken(user);
    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json({
      status: "success",
      message: "Login exitoso",
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al iniciar sesion",
      data: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Usuario no encontrado",
        data: null,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error al obtener perfil",
      data: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
