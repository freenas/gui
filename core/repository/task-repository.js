/**
 * @module core/repository/task-repository
 */
var AbstractRepository = require("core/repository/abstract-repository").AbstractRepository,
    TaskDao = require("core/dao/task-dao").TaskDao;
/**
 * @class TaskRepository
 * @extends AbstractRepository
 */
exports.TaskRepository = AbstractRepository.specialize(/** @lends TaskRepository# */ {
    init: {
        value: function (taskDao) {
            this._taskDao = taskDao || TaskDao.instance;
        }
    },

    listTasks: {
        value: function () {
            return this._taskDao.find({}, true, 25);
        }
    },

    findTasks: {
        value: function (filter) {
            return this._taskDao.find(filter, true, Object.keys(filter).length > 0 ? 0 : 25);
        }
    }
});
