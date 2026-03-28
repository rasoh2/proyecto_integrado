const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El titulo es requerido",
        },
        len: {
          args: [3, 150],
          msg: "El titulo debe tener entre 3 y 150 caracteres",
        },
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El contenido es requerido",
        },
      },
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
  },
  {
    tableName: "posts",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Post;
