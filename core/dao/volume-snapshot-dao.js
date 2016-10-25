var AbstractDao = require("core/dao/abstract-dao").AbstractDao;

exports.VolumeSnapshotDao = AbstractDao.specialize({
    init: {
        value: function() {
            this._model = this.constructor.Model.VolumeSnapshot;
        }
    }
});
