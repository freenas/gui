var Montage = require("montage").Montage;

exports.VmDeviceVolume = Montage.specialize({
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
    _auto: {
        value: null
    },
    auto: {
        set: function (value) {
            if (this._auto !== value) {
                this._auto = value;
            }
        },
        get: function () {
            return this._auto;
        }
    },
    _destination: {
        value: null
    },
    destination: {
        set: function (value) {
            if (this._destination !== value) {
                this._destination = value;
            }
        },
        get: function () {
            return this._destination;
        }
    },
    _source: {
        value: null
    },
    source: {
        set: function (value) {
            if (this._source !== value) {
                this._source = value;
            }
        },
        get: function () {
            return this._source;
        }
    },
    _type: {
        value: null
    },
    type: {
        set: function (value) {
            if (this._type !== value) {
                this._type = value;
            }
        },
        get: function () {
            return this._type;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "auto",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "destination",
            valueType: "String"
        }, {
            mandatory: false,
            name: "source",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueObjectPrototypeName: "VmDeviceVolumeType",
            valueType: "object"
        }]
    }
});
