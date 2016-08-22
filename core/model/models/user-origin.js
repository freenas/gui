var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.UserOrigin = AbstractModel.specialize({
    _directory: {
        value: null
    },
    directory: {
        set: function (value) {
            if (this._directory !== value) {
                this._directory = value;
            }
        },
        get: function () {
            return this._directory;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "directory",
            valueType: "String"
        }]
    }
});
