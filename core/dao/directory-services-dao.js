var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.DirectoryServicesDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.DirectoryServices;
        }
    }
});
