const { sequelize, testConnection, syncDatabase } = require("./src/models");

(async () => {
  try {
    // 1. Probar conexión
    const connected = await testConnection();
    console.log("");

    if (!connected) {
      console.error("❌ No se pudo conectar a la BD");
      process.exit(1);
    }

    // 2. Sincronizar la BD
    console.log("🔄 Sincronizando modelos con la base de datos...");
    await syncDatabase();
    console.log("✅ Sincronización completada\n");

    // 3. Verificar tablas
    console.log("📊 Consultando tablas...\n");
    const result = await sequelize.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    if (result[0].length > 0) {
      console.log("✅ Tablas encontradas:");
      result[0].forEach((row) => {
        console.log(`   - ${row.tablename}`);
      });
    } else {
      console.log("⚠️ No hay tablas en la BD");
    }

    // 4. Contar registros
    console.log("\n📈 Conteo de registros:");
    const tables = [
      "Users",
      "UserProfiles",
      "Posts",
      "Categories",
      "post_categories",
    ];

    for (const table of tables) {
      try {
        const count = await sequelize.query(
          `SELECT COUNT(*) as count FROM "${table}"`,
        );
        console.log(`   - ${table}: ${count[0][0].count} registros`);
      } catch (e) {
        console.log(`   - ${table}: (tabla no existe)`);
      }
    }

    console.log("\n✅ Verificación completada");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
})();
