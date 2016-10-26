var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.VolumeImporterDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.VolumeImporter;
        }
    }
});
