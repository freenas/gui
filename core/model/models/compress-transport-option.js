var Montage = require("montage").Montage;

exports.CompressTransportOption = Montage.specialize({
    _level: {
        value: null
    },
    level: {
        set: function (value) {
            if (this._level !== value) {
                this._level = value;
            }
        },
        get: function () {
            return this._level;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "level",
            valueObjectPrototypeName: "CompressPluginLevel",
            valueType: "object"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }]
    }
});
