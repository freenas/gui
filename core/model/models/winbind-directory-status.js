var Montage = require("montage").Montage;

exports.WinbindDirectoryStatus = Montage.specialize({
    _domain_controller: {
        value: null
    },
    domain_controller: {
        set: function (value) {
            if (this._domain_controller !== value) {
                this._domain_controller = value;
            }
        },
        get: function () {
            return this._domain_controller;
        }
    },
    _joined: {
        value: null
    },
    joined: {
        set: function (value) {
            if (this._joined !== value) {
                this._joined = value;
            }
        },
        get: function () {
            return this._joined;
        }
    },
    _server_time: {
        value: null
    },
    server_time: {
        set: function (value) {
            if (this._server_time !== value) {
                this._server_time = value;
            }
        },
        get: function () {
            return this._server_time;
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
            name: "domain_controller",
            valueType: "String"
        }, {
            mandatory: false,
            name: "joined",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "server_time",
            valueType: "datetime"
        }, {
            mandatory: false,
            name: "type"
        }]
    }
});
