/**
 * @module core/dao/network-host-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;
/**
 * @class NetworkHostDao
 * @extends AbstractDao
 */
exports.NetworkHostDao = AbstractDao.specialize(/** @lends NetworkHostDao# */ {
    init: {
        value: function() {
            this._model = Model.NetworkHost;
        }
    }
});
