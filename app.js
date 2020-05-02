(function () {
  const express = require("express");
  const log = console.log;
  const sequelize = require("./config/database");
  const flash = require("express-flash");
  const cookieSession = require("cookie-session");
  const passport = require("passport");
  const keys = require("./config/keys");
  const methodOverride = require('method-override')

  sequelize
    .authenticate()
    .then(() => {
      console.dir("Database connected successfully.. :)");
    })
    .catch((error) => {
      console.error(error);
      sequelize.close();
    });

  require("./models/user");
  require("./config/passport");

  sequelize.sync({ alter: true }).catch((error) => {
    console.log(error);
    throw new Error(error);
  });

  const app = express();

  app.set("view-engine", "ejs");
  app.use(express.urlencoded({ extended: true }));
  app.use(flash());
  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [keys.cookieKey],
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride("_method"));

  require("./routes/user-router")(app);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    require("figlet")("Passport login V2", (err, data) => {
      if (err) {
        throw new Error(err);
      }
      log(data);
    });
    log(`Server is listening on port ${PORT}`);
  });
})();
