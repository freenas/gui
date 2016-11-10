var Montage = require("montage").Montage;

exports.SmartAttribute = Montage.specialize({
    _flags: {
        value: null
    },
    flags: {
        set: function (value) {
            if (this._flags !== value) {
                this._flags = value;
            }
        },
        get: function () {
            return this._flags;
        }
    },
    _num: {
        value: null
    },
    num: {
        set: function (value) {
            if (this._num !== value) {
                this._num = value;
            }
        },
        get: function () {
            return this._num;
        }
    },
    _raw: {
        value: null
    },
    raw: {
        set: function (value) {
            if (this._raw !== value) {
                this._raw = value;
            }
        },
        get: function () {
            return this._raw;
        }
    },
    _threshold: {
        value: null
    },
    threshold: {
        set: function (value) {
            if (this._threshold !== value) {
                this._threshold = value;
            }
        },
        get: function () {
            return this._threshold;
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
    },
    _updated: {
        value: null
    },
    updated: {
        set: function (value) {
            if (this._updated !== value) {
                this._updated = value;
            }
        },
        get: function () {
            return this._updated;
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
    },
    _when_failed: {
        value: null
    },
    when_failed: {
        set: function (value) {
            if (this._when_failed !== value) {
                this._when_failed = value;
            }
        },
        get: function () {
            return this._when_failed;
        }
    },
    _worst: {
        value: null
    },
    worst: {
        set: function (value) {
            if (this._worst !== value) {
                this._worst = value;
            }
        },
        get: function () {
            return this._worst;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "flags",
            valueType: "String"
        }, {
            mandatory: false,
            name: "num",
            valueType: "number"
        }, {
            mandatory: false,
            name: "raw",
            valueType: "String"
        }, {
            mandatory: false,
            name: "threshold",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }, {
            mandatory: false,
            name: "updated",
            valueType: "String"
        }, {
            mandatory: false,
            name: "value",
            valueType: "String"
        }, {
            mandatory: false,
            name: "when_failed",
            valueType: "String"
        }, {
            mandatory: false,
            name: "worst",
            valueType: "String"
        }]
    }
});
