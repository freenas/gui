var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.ContainerDeviceCdrom = AbstractModel.specialize({
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "path",
            valueType: "String"
        }]
    }
});
