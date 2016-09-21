var Montage = require("montage").Montage;

exports.ServiceIpfs = Montage.specialize({
    _enable: {
        value: null
    },
    enable: {
        set: function (value) {
            if (this._enable !== value) {
                this._enable = value;
            }
        },
        get: function () {
            return this._enable;
        }
    },
    _path: {
        value: null
    },
    path: {
        set: function (value) {
            if (this._path !== value) {
                this._path = value;
            }
        },
        get: function () {
            return this._path;
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
    _webui: {
        value: null
    },
    webui: {
        set: function (value) {
            if (this._webui !== value) {
                this._webui = value;
            }
        },
        get: function () {
            return this._webui;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "enable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "type"
        }, {
            mandatory: false,
            name: "webui",
            valueType: "boolean"
        }]
    }
});
