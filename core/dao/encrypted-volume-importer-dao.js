var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.EncryptedVolumeImporterDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.EncryptedVolumeImporter;
        }
    }
});
