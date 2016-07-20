var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.DockerConfig = AbstractModel.specialize({
    _default_host: {
        value: null
    },
    default_host: {
        set: function (value) {
            if (this._default_host !== value) {
                this._default_host = value;
            }
        },
        get: function () {
            return this._default_host;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "default_host",
            valueType: "String"
        }]
    }
});
