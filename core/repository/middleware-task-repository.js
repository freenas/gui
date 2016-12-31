var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    MiddlewareClient = require("core/service/middleware-client").MiddlewareClient,
    TaskDao = require("core/dao/task-dao").TaskDao;

exports.MiddlewareTaskRepository = AbstractRepository.specialize({
    init: {
        value: function(middlewareTaskDao) {
            this._middlewareClient = MiddlewareClient.getInstance();
            this._taskDao = middlewareTaskDao || new TaskDao();
        }
    },

    getNewMiddlewareTaskWithNameAndArgs: {
        value: function(name, args) {
            return this._taskDao.getNewInstance().then(function(task) {
                task.name = name;
                task.args = args;
                return task;
            });
        }
    },

    runMiddlewareTask: {
        value: function(task) {
            return this._middlewareClient.submitTask(task.name, task.args);
        }
    }
});
