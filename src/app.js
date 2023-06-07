require("dotenv").config()
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require("express-session");
const passport = require("passport")
const { loginGoogleInitialize } = require("./services/googleServices");
loginGoogleInitialize
const cors = require('cors')


const homeRouter = require('./routes/home');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')
const productsRouter = require('./routes/products');
const cookieCheck = require("./middlewares/cookieCheck");
const localsUserCheck = require('./middlewares/localsUserCheck');
const userApiRouter = require('./routes/api/users');
const productApiRouter = require('./routes/api/products');
const commentApiRouter = require('./routes/api/comments');
const cartApiRouter = require('./routes/api/cart');

const app = express();
app.use(cors())
loginGoogleInitialize()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'..', 'public')));
app.use(methodOverride('_method'));
app.use( session({
    secret: "TechMaster",
    resave :false,
    saveUninitialized : true
  })
);
app.use(cookieCheck);
app.use(localsUserCheck)
app.use(passport.initialize())
app.use(passport.session())


app.use('/', homeRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/auth',authRouter)
// apis
app.use('/api/users', userApiRouter);
app.use('/api/products', productApiRouter);
app.use('/api/comments', commentApiRouter);
app.use('/api/cart', cartApiRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;