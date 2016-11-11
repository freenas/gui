var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.DirectoryserviceConfigDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.DirectoryserviceConfig;
        }
    }
});
