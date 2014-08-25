
/*
 * GET users listing.
 *
 *
 * why does exports preface everything?
 * "when you require something, you get everything that is exported"
 * "this means that the return value from a require can be anything: a class, a hash, a function or a variable"
 *      --> so essentially, require == import/include when item is exported
 *
 *
 * req --> request
 * res --> response
 */
exports.list = function(req, res, next){
  req.db.tasks.find({completed: false}).toArray(function(error, tasks){
    if (error) return next(error);

    categories = [];
    for (var i=0; i<tasks.length; i++) {
        var b = false;
        for (var j=0; j<categories.length; j++) {
            if (categories[j] == tasks[i].category) {
                b = true;
            }
        }
        if (b == false) {
            categories.push(tasks[i].category);
        }
    }
    console.info(categories);

    res.render('tasks', {
      title: 'Todo List',
      tasks: tasks || [],
      categories: categories
    });
  });
};

exports.add = function(req, res, next){
  if (!req.body || !req.body.name) return next(new Error('No data provided.'));
  req.db.tasks.save({
    name: req.body.name,
    category: req.body.category || "",
    completed: false
  }, function(error, task){
    if (error) return next(error);
    if (!task) return next(new Error('Failed to save.'));
    console.info('Added %s with id=%s', task.name, task._id);
    res.redirect('/tasks');
  })
};

exports.markAllCompleted = function(req, res, next) {
  if (!req.body.all_done || req.body.all_done !== 'true') return next();
  req.db.tasks.update({
    completed: false
  }, {$set: {
    completed: true
  }}, {multi: true}, function(error, count){
    if (error) return next(error);
    console.info('Marked %s task(s) completed.', count);
    res.redirect('/tasks');
  })
};

exports.completed = function(req, res, next) {
  req.db.tasks.find({completed: true}).toArray(function(error, tasks) {
    res.render('tasks_completed', {
      title: 'Completed',
      tasks: tasks || []
    });
  });
};

exports.markChanged = function(req, res, next) {
  if (!req.body.completed) return next(new Error('Param is missing'));
  req.db.tasks.updateById(req.task._id, {$set: {completed: req.body.completed === 'true'}}, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    if (req.body.completed === 'true') {
        console.info('Marked task %s with id=%s completed.', req.task.name, req.task._id);
        res.redirect('/tasks');
    } else {
        console.info('Marked task %s with id=%s incompleted.', req.task.name, req.task._id);
        res.redirect('/tasks/completed');
    }
  })
};

exports.del = function(req, res, next) {
  req.db.tasks.removeById(req.task._id, function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Deleted task %s with id=%s completed.', req.task.name, req.task._id);
    res.send(200);
  });
};
