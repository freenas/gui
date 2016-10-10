var Montage = require("montage").Montage;

exports.CompressReplicationTransportOption = Montage.specialize({
    "_%type": {
        value: null
    },
    "%type": {
        set: function (value) {
            if (this["_%type"] !== value) {
                this["_%type"] = value;
            }
        },
        get: function () {
            return this["_%type"];
        }
    },
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "level",
            valueObjectPrototypeName: "CompressPluginLevel",
            valueType: "object"
        }]
    }
});
