/**
 * @module core/dao/task-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class TaskDao
 * @extends AbstractDao
 */
exports.TaskDao = AbstractDao.specialize(/** @lends TaskDao# */ {
    init: {
        value: function () {
            this._model = this.constructor.Model.Task;
        }
    }
});
