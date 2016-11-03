/**
 * @module core/dao/alert-settings-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class AlertSettingsDao
 * @extends AbstractDao
 */
exports.AlertSettingsDao = AbstractDao.specialize(/** @lends AlertSettingsDao# */ {
    constructor: {
        value: function AlertSettingsDao() {
            this.super();
        }
    }
});
