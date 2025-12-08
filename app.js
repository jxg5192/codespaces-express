var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

var hbs = require('hbs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// to reference header and footer
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
hbs.registerPartial('partial_name', 'partial value');

hbs.registerHelper('eq', function(a,b){
  return a === b;
});

// app.use('/', indexRouter);
// app.use('/users', usersRouter);


app.get('/', function(req, res, next) {
  res.render('index', { title: 'Curly Care Coach' });
});

app.get('/quiz', function(req,res,next){
  res.render('quiz', {title:'Curly Care Coach - Quiz'});
});

app.get('/routine', function(req,res,next){
  res.render('routine', {title:'Curly Care Coach - Your Routine'});
});

// app.get('/', function(req,res,next){
//   res.render('index', {title:'Express'});
// });

app.get('/page2', function(req,res,next){
  res.render('index', {title:'page2'});
});


// can use this to personalize data/page for each user based on the URL 
// can grab things from lists in your database
app.get('/user/:name', function(req,res,next){
  res.render('index', {title:req.params.name});
});




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
