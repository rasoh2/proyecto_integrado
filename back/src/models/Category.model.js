const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: {
        msg: "La categoria ya existe",
      },
      validate: {
        notEmpty: {
          msg: "El nombre de la categoria es requerido",
        },
      },
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Category;
