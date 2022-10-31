const user = require('../models/auth');
var passport = require('passport');
const bcrypt = require('bcrypt');

module.exports.admin = async (req, res) => {
    const exists = await user.exists({ username: "admin" });
    if(exists)
    {
      res.redirect('/login');
      return;
    };
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return nextTick(err);
      bcrypt.hash("pass", salt, function (err, hash) {
        if (err) return nextTick(err);
        const newAdmin = new user({
          username: 'admin',
          password: hash,
          name: 'AdminAdmin',
          emailAddr: 'Admin@admin.com'
        });
        newAdmin.save();
      });
    });
  }

module.exports.loginForm = (req, res) => {
  const errors = req.flash().error || [];
  res.render('auth/login', { errors });
}

module.exports.login = passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/login?error=true',
    failureFlash: true,
    successFlash: true
})

module.exports.logout = function (req, res, next){
  req.logout(function(err){
      if(err) return next(err);
      res.redirect('/login');
    });
  }

module.exports.registerForm = (req,res) => {
    const passedVariable = req.query.valid;
    res.render('auth/register', { passedVariable });
  }

module.exports.register = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const exists = await user.exists({ username: username, emailAddr: email });
    if(exists)
    {
      const string = encodeURIComponent('Username or Email Already Exists!') || [];
      res.redirect('/register?valid=' + string);
      return;
    };
    const name = firstname + " " + lastname;
    bcrypt.genSalt(10, function (err, salt) {
      if (err) return nextTick(err);
      bcrypt.hash(password, salt, function (err, hash) {
        if (err) return nextTick(err);
        const newUser = new user({
          username: username,
          password: hash,
          name: name,
          emailAddr: email
        });
        newUser.save();
      });
    });
    res.redirect('/login');
  }