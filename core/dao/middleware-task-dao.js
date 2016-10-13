var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.MiddlewareTaskDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.Task;
        }
    }
});
