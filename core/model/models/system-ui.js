var Montage = require("montage").Montage;

exports.SystemUi = Montage.specialize({
    _webui_http_port: {
        value: null
    },
    webui_http_port: {
        set: function (value) {
            if (this._webui_http_port !== value) {
                this._webui_http_port = value;
            }
        },
        get: function () {
            return this._webui_http_port;
        }
    },
    _webui_http_redirect_https: {
        value: null
    },
    webui_http_redirect_https: {
        set: function (value) {
            if (this._webui_http_redirect_https !== value) {
                this._webui_http_redirect_https = value;
            }
        },
        get: function () {
            return this._webui_http_redirect_https;
        }
    },
    _webui_https_certificate: {
        value: null
    },
    webui_https_certificate: {
        set: function (value) {
            if (this._webui_https_certificate !== value) {
                this._webui_https_certificate = value;
            }
        },
        get: function () {
            return this._webui_https_certificate;
        }
    },
    _webui_https_port: {
        value: null
    },
    webui_https_port: {
        set: function (value) {
            if (this._webui_https_port !== value) {
                this._webui_https_port = value;
            }
        },
        get: function () {
            return this._webui_https_port;
        }
    },
    _webui_listen: {
        value: null
    },
    webui_listen: {
        set: function (value) {
            if (this._webui_listen !== value) {
                this._webui_listen = value;
            }
        },
        get: function () {
            return this._webui_listen;
        }
    },
    _webui_protocol: {
        value: null
    },
    webui_protocol: {
        set: function (value) {
            if (this._webui_protocol !== value) {
                this._webui_protocol = value;
            }
        },
        get: function () {
            return this._webui_protocol;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "webui_http_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "webui_http_redirect_https",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "webui_https_certificate",
            valueType: "String"
        }, {
            mandatory: false,
            name: "webui_https_port",
            valueType: "number"
        }, {
            mandatory: false,
            name: "webui_listen",
            valueType: "array"
        }, {
            mandatory: false,
            name: "webui_protocol",
            valueType: "array"
        }]
    }
});
