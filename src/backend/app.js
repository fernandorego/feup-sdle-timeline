var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const {program} = require('commander');

// Arguments options
program.option('-p, --port <port>', 'port to listen on', '8000');
program.option('-d, --debug', 'enable debugging');
program.option('-ip, --ip <ip>', 'ip to listen on', '127.0.1.0');


// parse arguments
program.parse(process.argv);
const options = program.opts();
const port = options.port;
const ip = options.ip;
const debug = options.debug;


var app = express();

// set port to port
process.env.PORT = port;

const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("origin: " + origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: false
};

app.use(cors(corsOptions));




 


console.log("port = " + port);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
