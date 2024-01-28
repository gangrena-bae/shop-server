const { Sequelize } = require("sequelize");
module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }
);

/**
 * Файл db.js содержит код для подключения к базе данных.
 * Используется пакет Sequelize для работы с базой данных PostgreSQL.
 * Экспортируется экземпляр Sequelize, настроенный с помощью переменных окружения.
 */
