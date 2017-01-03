var Montage = require("montage").Montage;

exports.DatasetsReplicationPair = Montage.specialize({
    _master: {
        value: null
    },
    master: {
        set: function (value) {
            if (this._master !== value) {
                this._master = value;
            }
        },
        get: function () {
            return this._master;
        }
    },
    _slave: {
        value: null
    },
    slave: {
        set: function (value) {
            if (this._slave !== value) {
                this._slave = value;
            }
        },
        get: function () {
            return this._slave;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "master",
            valueType: "String"
        }, {
            mandatory: false,
            name: "slave",
            valueType: "String"
        }]
    }
});
