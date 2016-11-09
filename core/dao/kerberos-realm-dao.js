var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.KerberosRealmDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.KerberosRealm;
        }
    }
});
