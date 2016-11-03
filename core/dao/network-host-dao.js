/**
 * @module core/dao/network-host-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class NetworkHostDao
 * @extends AbstractDao
 */
exports.NetworkHostDao = AbstractDao.specialize(/** @lends NetworkHostDao# */ {
    init: {
        value: function() {
            this._model = this.constructor.Model.NetworkHost;
        }
    }
});
