var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;

exports.DockerConfigDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = Model.DockerConfig;
        }
    }
});
