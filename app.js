
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var tasks = require('./routes/tasks');
var http = require('http');
var path = require('path');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe:true});
var app = express();

// export database object to all middlewares
// in doing so, we can perform database operations in routes module
app.use(function(req, res, next) {
  req.db = {};
  req.db.tasks = db.collection('tasks');
  next();
})

// locals gives variables to all templates rendered in application
app.locals.appname = 'Todo App'
// all environments


app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'}));
app.use(express.csrf());

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
  res.locals._csrf = req.session._csrf;
  return next();
})
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
app.param('task_id', function(req, res, next, taskId) {
  req.db.tasks.findById(taskId, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Task is not found.'));
    req.task = task;
    return next();
  });
});

app.get('/', routes.index);
app.get('/tasks', tasks.list);

// the second arguments are functions in tasks -- see tasks = require(' ...
app.post('/tasks', tasks.markAllCompleted)
app.post('/tasks', tasks.add);
app.post('/tasks/:task_id', tasks.markChanged);
app.del('/tasks/:task_id', tasks.del);
app.get('/tasks/completed', tasks.completed);
app.all('*', function(req, res){
  res.send(404);
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});
