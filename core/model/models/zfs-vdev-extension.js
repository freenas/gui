var Montage = require("montage/core/core").Montage;
var ZfsVdev = require("core/model/models/zfs-vdev").ZfsVdev;

exports.ZfsVdevExtension = Montage.specialize({
    _target_guid: {
        value: null
    },
    target_guid: {
        set: function (value) {
            if (this._target_guid !== value) {
                this._target_guid = value;
            }
        },
        get: function () {
            return this._target_guid;
        }
    },
    _vdev: {
        value: null
    },
    vdev: {
        set: function (value) {
            if (this._vdev !== value) {
                this._vdev = value;
            }
        },
        get: function () {
            return this._vdev || (this._vdev = new ZfsVdev());
        }
    }
});
