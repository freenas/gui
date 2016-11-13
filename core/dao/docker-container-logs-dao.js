var AbstractDao = require("core/dao/abstract-dao").AbstractDao,
    Model = require("core/model/model").Model;

exports.DockerContainerLogsDao = AbstractDao.specialize({
    init: {
        value: function () {
            this._model = this.constructor.Model.DockerContainerLogs;
        }
    }
});
