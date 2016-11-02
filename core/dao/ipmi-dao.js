/**
 * @module core/dao/ipmi-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;
/**
 * @class IpmiDao
 * @extends AbstractDao
 */
exports.IpmiDao = AbstractDao.specialize(/** @lends IpmiIsLoadedDao# */ {
    init: {
        value: function() {
            this._model = Model.Ipmi;
        }
    }

});
