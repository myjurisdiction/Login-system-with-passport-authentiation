const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({
    where: {
      id,
    },
  });
  done(null, user);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const existingUser = await User.findOne({
          where: {
            email: email,
          },
        });
        if (!existingUser || !existingUser.validatePassword(password)) {
          throw new Error();
        }
        return done(null, existingUser);
      } catch (error) {
        return done(null, false, {
          message: { password: "Invalid password" },
        });
      }
    }
  )
);
