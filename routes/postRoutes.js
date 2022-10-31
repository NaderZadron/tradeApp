const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const postDB = require("../models/postSchema");
const appError = require("../appError");
const { postSchema } = require("../models/postSchemaValidator");
const { countDocuments, findById } = require("../models/postSchema");
const userDB = require("../models/auth");
const { connection } = require("mongoose");
const { Cookie } = require("express-session");
const { func } = require("joi");
const { validatePost, isLoggedIn } = require('../middleware/middleware');
const post = require('../controllers/post');

router.route('/')
// veiw all data
    .get(post.allPosts)
// Add new post to db
    .post(isLoggedIn, validatePost, post.createPost);

// Create post page render
router.get('/new', isLoggedIn, post.createForm);

// Show single post
router.route('/:id')
    .get(post.showPost)
// Edit single post
    .put(isLoggedIn, validatePost, post.editPost)
// Delete a sinlge post
    .delete(isLoggedIn, post.deletePost);
    
router.get('/:id/edit', isLoggedIn, post.editPostForm);

// single user routes
router.get('/user/posts', isLoggedIn);

module.exports = router;