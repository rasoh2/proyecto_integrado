const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const UserProfile = sequelize.define(
  "UserProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: "user_id",
    },
  },
  {
    tableName: "user_profiles",
    timestamps: true,
    underscored: true,
  },
);

module.exports = UserProfile;
