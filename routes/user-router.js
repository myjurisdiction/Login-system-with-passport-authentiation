"use strict";

const log = console.log;
const User = require("../models/user");
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middlewares/middleware");

module.exports = (app) => {
  app.get("/", checkAuthenticated, (req, res) => {
    res.render("home.ejs", { quote: "Success loves prepration !!" });
  });

  app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
  });

  app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
  });

  app.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = await User.create({ username, email, password });
      if (!user) {
        throw new Error("something went wrong");
      }
      res.redirect("/login");
    } catch (error) {
      log(error);
      res.redirect("/register");
    }
  });

  app.post(
    "/login",
    checkNotAuthenticated,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
    })
  );

  app.delete("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });
};
