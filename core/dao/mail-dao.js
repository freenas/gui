/**
 * @module core/dao/mail-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class MailDao
 * @extends AbstractDao
 */
exports.MailDao = AbstractDao.specialize(/** @lends MailDao# */ {
    init: {
        value: function () {
            this._model = this.constructor.Model.Mail;
        }
    }
});
