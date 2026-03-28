const { Sequelize } = require("sequelize");

(async () => {
  try {
    // Conexión SIN especificar BD para ver si la BD existe
    const sequelize = new Sequelize("postgres", "postgres", "postgres", {
      host: "localhost",
      port: 5432,
      dialect: "postgres",
    });

    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL");

    // Consultar si existe la BD
    const result = await sequelize.query(
      "SELECT datname FROM pg_database WHERE datname = 'node_express_webapp'",
    );

    if (result[0].length > 0) {
      console.log('✅ BD "node_express_webapp" EXISTE\n');

      // Podemos conectar a la BD y sincronizar
      const db = require("./src/models");
      console.log("\n🔄 Sincronizando tablas...");
      await db.syncDatabase();
      console.log("✅ Base de datos lista para usar");
    } else {
      console.log('❌ BD "node_express_webapp" NO EXISTE\n');

      // Crear la BD
      console.log("🔨 Creando base de datos...");
      await sequelize.query("CREATE DATABASE node_express_webapp");
      console.log("✅ BD creada exitosamente");

      // Ahora sincronizar
      await sequelize.close();
      const db = require("./src/models");
      console.log("\n🔄 Sincronizando tablas...");
      await db.syncDatabase();
      console.log("✅ Base de datos lista para usar");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.parent) {
      console.error("   Detalles:", error.parent.message);
    }
    process.exit(1);
  }
})();
