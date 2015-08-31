var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var MongoClient = require('mongodb').MongoClient;
//var assert = require('assert');
//var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var methodOverride = require('method-override');

var Info = require('./models/info');
 
var routes = require('./routes/index');

var app = express();


//For Local Usage
mongoose.connect('mongodb://spartadbuser:spartadbuser@127.0.0.1:27017/spartans', function (err) {
    if (err) 
      throw err;

    console.log("Successfully connected to MongoDB");
    Info.find({"username":"sumit"}, function (err, Info) {console.log(Info)})
     console.log("After connected to MongoDB");
});

var options = { 
    server: { 
        socketOptions: { 
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS : 30000
        } 
    }
};

//mongoose.connect('mongodb://delrsin4011626:27017/spartans',options);
//mongoose.connect('mongodb://127.0.0.1:27017/spartans',options);
/*, function (err) {
    if (err) 
      throw err;

    console.log("Successfully connected to MongoDB");
    Info.find({"username":"sumit"}, function (err, Info) {console.log(Info)})
     console.log("After connected to MongoDB");
});*/
var db = mongoose.connection;
db.on('error', function(msg) {
  console.log('Mongoose connection error %s', msg);
});

db.once('open', function() {
  console.log('Mongoose connection established');
});

db.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
