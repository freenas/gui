var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.ShareDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.Share;
        }
    }
});

