1. Pay Comcastdelete

2. Get Catherine to pay storage unitdelete

3. Get nick till august comcast
### practice ###
- try to make it so you can change completed tasks to incomplete

### TODO ###
1 add categories
2 make subtasks
3 Add ability to edit tasks
4 Add priorities

### Far Off TODO ###
- make favorite tasks
- redo same task over and over again

### README ###
- based on [tutorial](http://webapplog.com/todo-app-with-express-jsnode-js-and-mongodb/)
- [source code](http://github.com/azat-co/todo-express).

#### Database Things ####
    // app.js code
    var db = mongoskin.db('mongodb://localhost:27017/todo?auto_reconnect', {safe:true});

    // use mongo shell
    $ mongo 
    > use todo
    > db.tasks.find().pretty()
    
    other useful commands:
    > show dbs
    > show collections
    > var a = db.tasks.find().limit(10);
    > db.tasks.remove()

---
Original things:
> Todo app with Express.js

This is an example of classical (no front-end JavaScript frameworks) web application built with Express.js 3.3.5.
The full source code is available at [github.com/azat-co/todo-express](http://github.com/azat-co/todo-express).

More Express.js in [Express.js Guide](http://expressjsguide.com).

More Node.js frameworks at [nodeframework.com](http://nodeframework.com).
