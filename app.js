
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , less = require('less-middleware')
  , bsPath = path.join(__dirname, 'node_modules', 'bootstrap');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());  
  
  // Twitter Bootstrap 
  app.use('/img', express['static'](path.join(bsPath, 'img')));
  app.use(less({
    src    : path.join(__dirname, 'assets', 'less'),
    paths  : [path.join(bsPath, 'less')],
    dest   : path.join(__dirname, 'public', 'stylesheets'),
    prefix : '/stylesheets',
    compress: true
  }));
  
  
  // App Routes
  app.use(app.router);
  
  // Static files in public/
  app.use(express.static(path.join(__dirname, 'public')));

});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
