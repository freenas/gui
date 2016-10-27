var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;

exports.UserDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = Model.User;
        }
    }
});
