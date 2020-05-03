function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // if true return next(); else redirect to login('login')
      return next();
    }
  
    res.redirect("/login");
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { // if true return to home page ele return next();
      return res.redirect("/");
    }
    next();
  }
  
  module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
  };
  