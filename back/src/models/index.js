/**
 * Punto de entrada para todos los modelos
 * Exporta todos los modelos y la instancia de Sequelize
 */

const {
  sequelize,
  testConnection,
  syncDatabase,
} = require("../config/database");
const User = require("./User.model");
const UserProfile = require("./UserProfile.model");
const Post = require("./Post.model");
const Category = require("./Category.model");

// 1:1 -> Un usuario tiene un perfil
User.hasOne(UserProfile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});
UserProfile.belongsTo(User, { foreignKey: "userId", as: "user" });

// 1:N -> Un usuario puede tener muchos posts
User.hasMany(Post, {
  foreignKey: "userId",
  as: "posts",
  onDelete: "CASCADE",
});
Post.belongsTo(User, { foreignKey: "userId", as: "author" });

// N:M -> Un post puede tener muchas categorias y viceversa
Post.belongsToMany(Category, {
  through: "post_categories",
  as: "categories",
  foreignKey: "postId",
  otherKey: "categoryId",
});
Category.belongsToMany(Post, {
  through: "post_categories",
  as: "posts",
  foreignKey: "categoryId",
  otherKey: "postId",
});

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  User,
  UserProfile,
  Post,
  Category,
};
