// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const postDB = require("./models/postSchema");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const appError = require('./appError');
const { valid } = require("joi");
const { postSchema } = require('./models/postSchemaValidator')
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookie = require('cookie-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const passport = require('passport')
const localStrategy = require("passport-local").Strategy;
const user = require('./models/auth');
const mongoSanitize = require('express-mongo-sanitize');
const { query } = require("express");
const MongoStore = require('connect-mongo');

// Connect to mongodb
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/tradeApp';
const secret = process.env.SECRET || 'thismightbeasecret';
mongoose.connect('mongodb://localhost:27017/tradeApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => 
        console.log('Database Connected'))
    .catch((err) => {
        console.log('Erorr', err)
    })

// const store = MongoStore.create({
//         mongoUrl: dbUrl,
//         secret,
//         touchAfter: 24 * 60 * 60,
//         crypto: {
//             secret: 'squirrel'
//         }
//     });



// store.on("error", function(e){
//     console.log("SESSION STORE ERROR");
// })
const cookieConfiq = {
    // store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // In a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

// middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(cookieParser());
app.use(session(cookieConfiq));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(flash());
app.use(mongoSanitize());
// app.use(helmet());
// app.use(helmet.contentSecurityPolicy({ contentSecurityPolicy: false }));



// Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    user.findById(id, function (err, user) {
        done(err, user);
    });
})

passport.use(new localStrategy(function (username, password, done) {
    user.findOne({ username: username }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorect Email Address or password'});
        bcrypt.compare(password, user.password, function(err, res) {
            if (err) return done(err);
            if(res == false) return done(null, false, { message: "Incorrect Email Address or password"});
            return done(null, user);
        });
    });
  })); 

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.danger = req.flash('danger');
    next();
})

app.get('/', (req, res) => {
    res.render('landing/home');
})

// Routes
app.use('/posts', postRoutes);
app.use('', authRoutes);
app.use('/posts', userRoutes);

app.all('*', (req, res, next) => {
    next(new appError('Page Not Found', 404))
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('layout/error', { err });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});