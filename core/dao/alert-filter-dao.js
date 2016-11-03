/**
 * @module core/dao/alert-filter-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class AlertFilterDao
 * @extends AbstractDao
 */
exports.AlertFilterDao = AbstractDao.specialize(/** @lends AlertFilterDao# */ {
    init: {
        value: function () {
            this._model = this.constructor.Model.AlertFilter;
        }
    }
});
