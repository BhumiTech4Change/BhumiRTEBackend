var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var config = require('./config/database');
var indexRouter = require('./routes/index');
var protectedRouter = require('./routes/protected');
var mongoose = require('mongoose');
var app = express();




app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(config.database);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', indexRouter);
app.use('/form', passport.authenticate('jwt', {session: false}), protectedRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.send('Error 404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err)
});

module.exports = app;
