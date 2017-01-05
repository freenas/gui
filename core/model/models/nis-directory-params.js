var Montage = require("montage").Montage;

exports.NisDirectoryParams = Montage.specialize({
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
    _domain: {
        value: null
    },
    domain: {
        set: function (value) {
            if (this._domain !== value) {
                this._domain = value;
            }
        },
        get: function () {
            return this._domain;
        }
    },
    _server: {
        value: null
    },
    server: {
        set: function (value) {
            if (this._server !== value) {
                this._server = value;
            }
        },
        get: function () {
            return this._server;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "%type"
        }, {
            mandatory: false,
            name: "domain",
            valueType: "String"
        }, {
            mandatory: false,
            name: "server",
            valueType: "String"
        }]
    }
});
