const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config/database');
const indexRouter = require('./routes/index');
const protectedRouter = require('./routes/protected');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

require('dotenv').config();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(config.database, {useNewUrlParser: true, useUnifiedTopology: true});
app.use(cors({
  origin: '*', optionsSuccessStatus: 200 // some legacy browsers (IE11, constious SmartTVs) choke on 204
}));

app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));


app.use('/', indexRouter);
app.use('/form', passport.authenticate('jwt', {session: false}), protectedRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.send('Error 404');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err)
});

module.exports = app;
