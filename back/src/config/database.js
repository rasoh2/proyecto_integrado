/**
 * Configuración de la conexión a la base de datos PostgreSQL
 * Utiliza Sequelize como ORM
 */

const { Sequelize } = require("sequelize");
const path = require("path");

const envPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: envPath, override: true });

// Crear instancia de Sequelize con las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false, // Desactivado para no ver las consultas SQL en la terminal
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

/**
 * Prueba la conexión a la base de datos
 * @returns {Promise<boolean>} true si la conexión es exitosa
 */
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a PostgreSQL establecida correctamente");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con PostgreSQL:");
    console.error("   name:", error.name || "desconocido");
    console.error("   message:", error.message || "(sin mensaje)");
    if (error.parent) {
      console.error("   code:", error.parent.code || "(sin codigo)");
      console.error("   detail:", error.parent.detail || "(sin detalle)");
      console.error("   address:", error.parent.address || "(sin address)");
      console.error("   port:", error.parent.port || "(sin port)");
    }
    throw error;
  }
};

/**
 * Sincroniza los modelos con la base de datos
 * @param {boolean} force - Si es true, elimina las tablas existentes
 */
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log("✅ Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error.message);
    throw error;
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
};
