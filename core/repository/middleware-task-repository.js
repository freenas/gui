var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    MiddlewareTaskDao = require("core/dao/middleware-task-dao").MiddlewareTaskDao;

exports.MiddlewareTaskRepository = AbstractRepository.specialize({
    init: {
        value: function(middlewareTaskDao) {
            this._middlewareTaskDao = middlewareTaskDao || MiddlewareTaskDao.instance;
        }
    },

    getNewMiddlewareTaskWithNameAndArgs: {
        value: function(name, args) {
            return this._middlewareTaskDao.getNewInstance().then(function(task) {
                task.name = name;
                task.args = args;
                return task;
            });
        }
    },

    runMiddlewareTask: {
        value: function(task) {
            return task.constructor.services.submit(task.name, task.args);
        }
    }
});
