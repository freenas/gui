/**
 * @module core/dao/support-ticket-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class SupportTicketDao
 * @extends AbstractDao
 */
exports.SupportTicketDao = AbstractDao.specialize(/** @lends SupportTicketDao# */ {
    init: {
        value: function() {
            this._model = this.constructor.Model.SupportTicket;
        }
    }
});
