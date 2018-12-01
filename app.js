var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var webhookRouter = require('./routes/webhook');
var pushRouter = require('./routes/push');
var perminRouter = require('./routes/permin');
var roomsRouter = require('./routes/rooms');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', '/images/favicon.ico')));
app.use(methodOverride());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webhook', webhookRouter);
app.use('/push', pushRouter);
app.use('/permin', perminRouter);
app.use('/rooms', roomsRouter);
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
