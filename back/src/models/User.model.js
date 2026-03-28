/**
 * Modelo de Usuario
 * Define la estructura de la tabla 'users' en la base de datos
 */

const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El nombre es requerido",
        },
        len: {
          args: [2, 100],
          msg: "El nombre debe tener entre 2 y 100 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: {
        msg: "Este email ya está registrado",
      },
      validate: {
        isEmail: {
          msg: "Debe ser un email válido",
        },
        notEmpty: {
          msg: "El email es requerido",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña es requerida",
        },
        len: {
          args: [6, 255],
          msg: "La contraseña debe tener al menos 6 caracteres",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    underscored: true, // Usa snake_case en la base de datos (created_at, updated_at)
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
    hooks: {
      async beforeCreate(user) {
        user.password = await bcrypt.hash(user.password, 10);
      },
      async beforeUpdate(user) {
        if (user.changed("password")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  },
);

User.prototype.validatePassword = async function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
