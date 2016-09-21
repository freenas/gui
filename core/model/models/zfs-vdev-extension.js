var Montage = require("montage").Montage;

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
            return this._vdev;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "target_guid",
            valueType: "String"
        }, {
            mandatory: false,
            name: "vdev",
            valueObjectPrototypeName: "ZfsVdev",
            valueType: "object"
        }]
    }
});
