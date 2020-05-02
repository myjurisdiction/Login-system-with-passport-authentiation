"use strict";

const Sequelize = require("sequelize");
const keys = require("./keys");

const sequelize = new Sequelize(keys.dbName, keys.dbUsername, keys.dbPassword, {
  host: keys.dbHost,
  port: keys.dbPort,
  logging: false,
  dialect: keys.db_dialect,
  operatorAliases: false,
  pool: {
    max: 100,
    min: 10,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt", "deletedAt"],
      },
    },
  },
});

module.exports = sequelize;
