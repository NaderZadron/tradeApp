const { postSchema } = require('../models/postSchemaValidator')
const appError = require('../appError');
const postDB = require('../models/postSchema');


module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new appError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/posts');
  }

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

