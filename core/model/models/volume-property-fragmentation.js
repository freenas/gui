var Montage = require("montage").Montage;

exports.VolumePropertyFragmentation = Montage.specialize({
    _parsed: {
        value: null
    },
    parsed: {
        set: function (value) {
            if (this._parsed !== value) {
                this._parsed = value;
            }
        },
        get: function () {
            return this._parsed;
        }
    },
    _rawvalue: {
        value: null
    },
    rawvalue: {
        set: function (value) {
            if (this._rawvalue !== value) {
                this._rawvalue = value;
            }
        },
        get: function () {
            return this._rawvalue;
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
    _value: {
        value: null
    },
    value: {
        set: function (value) {
            if (this._value !== value) {
                this._value = value;
            }
        },
        get: function () {
            return this._value;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "parsed",
            valueObjectPrototypeName: "VolumePropertyFragmentationValue",
            valueType: "object"
        }, {
            mandatory: false,
            name: "rawvalue",
            readOnly: true,
            valueType: "String"
        }, {
            mandatory: false,
            name: "source",
            valueObjectPrototypeName: "VolumePropertySource",
            valueType: "object"
        }, {
            mandatory: false,
            name: "value",
            valueType: "String"
        }]
    }
});
