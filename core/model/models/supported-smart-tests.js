var Montage = require("montage").Montage;

exports.SupportedSmartTests = Montage.specialize({
    _conveyance: {
        value: null
    },
    conveyance: {
        set: function (value) {
            if (this._conveyance !== value) {
                this._conveyance = value;
            }
        },
        get: function () {
            return this._conveyance;
        }
    },
    _long: {
        value: null
    },
    long: {
        set: function (value) {
            if (this._long !== value) {
                this._long = value;
            }
        },
        get: function () {
            return this._long;
        }
    },
    _offline: {
        value: null
    },
    offline: {
        set: function (value) {
            if (this._offline !== value) {
                this._offline = value;
            }
        },
        get: function () {
            return this._offline;
        }
    },
    _selective: {
        value: null
    },
    selective: {
        set: function (value) {
            if (this._selective !== value) {
                this._selective = value;
            }
        },
        get: function () {
            return this._selective;
        }
    },
    _short: {
        value: null
    },
    short: {
        set: function (value) {
            if (this._short !== value) {
                this._short = value;
            }
        },
        get: function () {
            return this._short;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "conveyance",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "long",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "offline",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "selective",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "short",
            valueType: "boolean"
        }]
    }
});
