var Montage = require("montage").Montage;

exports.SmartTestResult = Montage.specialize({
    _asc: {
        value: null
    },
    asc: {
        set: function (value) {
            if (this._asc !== value) {
                this._asc = value;
            }
        },
        get: function () {
            return this._asc;
        }
    },
    _ascq: {
        value: null
    },
    ascq: {
        set: function (value) {
            if (this._ascq !== value) {
                this._ascq = value;
            }
        },
        get: function () {
            return this._ascq;
        }
    },
    _hours: {
        value: null
    },
    hours: {
        set: function (value) {
            if (this._hours !== value) {
                this._hours = value;
            }
        },
        get: function () {
            return this._hours;
        }
    },
    _lba: {
        value: null
    },
    lba: {
        set: function (value) {
            if (this._lba !== value) {
                this._lba = value;
            }
        },
        get: function () {
            return this._lba;
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
    _remain: {
        value: null
    },
    remain: {
        set: function (value) {
            if (this._remain !== value) {
                this._remain = value;
            }
        },
        get: function () {
            return this._remain;
        }
    },
    _segment: {
        value: null
    },
    segment: {
        set: function (value) {
            if (this._segment !== value) {
                this._segment = value;
            }
        },
        get: function () {
            return this._segment;
        }
    },
    _sense: {
        value: null
    },
    sense: {
        set: function (value) {
            if (this._sense !== value) {
                this._sense = value;
            }
        },
        get: function () {
            return this._sense;
        }
    },
    _status: {
        value: null
    },
    status: {
        set: function (value) {
            if (this._status !== value) {
                this._status = value;
            }
        },
        get: function () {
            return this._status;
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
            name: "asc",
            valueType: "String"
        }, {
            mandatory: false,
            name: "ascq",
            valueType: "String"
        }, {
            mandatory: false,
            name: "hours",
            valueType: "String"
        }, {
            mandatory: false,
            name: "lba",
            valueType: "String"
        }, {
            mandatory: false,
            name: "num",
            valueType: "number"
        }, {
            mandatory: false,
            name: "remain",
            valueType: "String"
        }, {
            mandatory: false,
            name: "segment",
            valueType: "String"
        }, {
            mandatory: false,
            name: "sense",
            valueType: "String"
        }, {
            mandatory: false,
            name: "status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type",
            valueType: "String"
        }]
    }
});
