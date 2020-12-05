module.exports={
  isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    req.session.error="You need to be logged in to do that.";
    req.session.redirectTo= req.originalUrl;
    res.redirect('/login');
  }
}
