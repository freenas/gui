/**
 * @module core/dao/section-settings-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class SectionSettingsDao
 * @extends AbstractDao
 */
exports.SectionSettingsDao = AbstractDao.specialize(/** @lends SectionSettingsDao# */ {
    constructor: {
        value: function SectionSettingsDao() {
            this.super();
        }
    }
});
