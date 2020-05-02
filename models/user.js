"use strict";

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const hashPassword = async (user) => {
    try {
      if (user.changed("password")) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
      }
    } catch (error) {
      throw new Error("Failed to hash the password", error);
    }
  };

class User extends Model {
  validatePassword(password) {
    const isMatch = bcrypt.compareSync(password, this.password);
    if (!isMatch) {
      throw new Error("Invalid Login");
    }
    return isMatch;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      required: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    hooks: {
      beforeValidate: hashPassword, // passing the instance of User -> user
    },
    modelName: "user",
    paranoid: true,
    timestamps: true,
    freezeTableName: true,
    underscored: true,
    tableName: "user",
  }
);

module.exports = User;
