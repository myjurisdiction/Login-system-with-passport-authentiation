const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/database');

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      required: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "blog",
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    tableName: "blog",
  }
);

module.exports = Blog;
