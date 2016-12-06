/**
 * @module core/dao/replication-options-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class ReplicationOptionsDao
 * @extends AbstractDao
 */
exports.ReplicationOptionsDao = AbstractDao.specialize(/** @lends ReplicationOptionsDao# */ {
    init: {
        value: function () {
            this._model = this.constructor.Model.ReplicationOptions;
        }
    }
});
