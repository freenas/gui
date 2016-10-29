var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.DiskDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.Disk;
        }
    }
});
