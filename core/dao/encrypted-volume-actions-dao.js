/**
 * @module core/dao/encrypted-volume-actions-dao
 */
var AbstractDao = require("core/dao/abstract-dao").AbstractDao;
/**
 * @class EncryptedVolumeActionsDao
 * @extends AbstractDao
 */
exports.EncryptedVolumeActionsDao = AbstractDao.specialize(/** @lends EncryptedVolumeActionsDao# */ {
    init: {
        value: function () {
            this._model = this.constructor.Model.EncryptedVolumeActions;
        }
    }
});
