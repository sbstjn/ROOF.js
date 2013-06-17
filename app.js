// Load Modules
var express = require('express')
  , http = require('http')
  , path = require('path')
  , less = require('less-middleware')
  , SessionSockets = require('session.socket.io')
  , MongoStore = require('connect-mongo')(express)
  , useragent = require('express-useragent')
  , bsPath = path.join(__dirname, 'node_modules', 'bootstrap')
  , afPath = path.join(__dirname, 'vendor', 'font-awesome')
  , io = require('socket.io');

// Init Express.js
var app = express()
  , cookieParser = express.cookieParser('cookiesecret1234')
  , sessionStore = new MongoStore({url: "mongodb://localhost:27017/roof/session"});
  
// "font-awesome": "git+https://github.com/FortAwesome/Font-Awesome.git#v3.2.0",
  
// Bind Socket.IO to Express.js session
var srv = http.createServer(app)
  , io = io.listen(srv)
  , sck = new SessionSockets(io, sessionStore, cookieParser)

// Configure Express.js
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  
  // Configure MongoDB/Cookie sessions
  app.use(cookieParser);
  app.use(express.session({
    store: sessionStore
  }));

  app.use(useragent.express());
  app.use(express.bodyParser());
  app.use(express.methodOverride());  
  
  // Twitter Bootstrap 
  app.use('/img', express['static'](path.join(bsPath, 'img')));
  app.use('/javascripts', express['static'](path.join(bsPath, 'docs/assets/js')))

  // Awesome Font
  app.use('/font', express['static'](path.join(afPath, 'font')));
  app.use('/stylesheets', express['static'](path.join(afPath, 'css')));

  // Less
  app.use(less({
    src    : path.join(__dirname, 'assets', 'less'),
    paths  : [path.join(bsPath, 'less')],
    dest   : path.join(__dirname, 'public', 'stylesheets'),
    prefix : '/stylesheets',
    compress: true
  }));
  
  // Static files in public/
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Global Template settings
  app.use(function(req, res, next){
    res.locals.software = 'ROOF.js';
    res.locals.version = '0.0.1';
    next();
  });
  
  // App Routes
  app.use(app.router);
});

// Development settings
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Staging settings
app.configure('staging', function(){

});

// Production settings
app.configure('production', function(){

});

app.get('/', function(req, res){
  res.render('index', { title: 'ROOF.js' });
});
  
// Socket Routes
sck.on('connection', function (err, socket, session) {});
  
// Listing
srv.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
