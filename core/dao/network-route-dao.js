var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.NetworkRouteDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.NetworkRoute;
        }
    }
});
