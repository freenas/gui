var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.KerberosKeytabDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.KerberosKeytab;
        }
    }
});
