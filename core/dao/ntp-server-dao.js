/**
 * @module core/dao/ntp-server-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class NtpServerDao
 * @extends AbstractDao
 */
exports.NtpServerDao = AbstractDao.specialize(/** @lends NtpServerDao# */ {
    init: {
        value: function() {
            this._model = this.constructor.Model.NtpServer;
        }
    }
});
