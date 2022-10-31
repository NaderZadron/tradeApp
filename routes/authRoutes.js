const express = require('express');
const router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var user = require('../models/auth');
var session = require('express-session');
const appError = require('../appError');
const { nextTick } = require('process');
const { isLoggedOut } = require('../middleware/middleware')
const a = require('../controllers/authorization');

// Admin setup
router.get('/setup', a.admin);

// Login
router.get('/login', isLoggedOut, a.loginForm);
router.post('/login', a.login);

// Logout
router.get('/logout', a.logout);

// Register
router.get('/register', a.registerForm);
router.post('/register', a.register);

module.exports = router;