var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.DirectoryDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.Directory;
        }
    }
});
