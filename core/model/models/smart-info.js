var Montage = require("montage").Montage;

exports.SmartInfo = Montage.specialize({
    _attributes: {
        value: null
    },
    attributes: {
        set: function (value) {
            if (this._attributes !== value) {
                this._attributes = value;
            }
        },
        get: function () {
            return this._attributes;
        }
    },
    _diagnostics: {
        value: null
    },
    diagnostics: {
        set: function (value) {
            if (this._diagnostics !== value) {
                this._diagnostics = value;
            }
        },
        get: function () {
            return this._diagnostics;
        }
    },
    _firmware: {
        value: null
    },
    firmware: {
        set: function (value) {
            if (this._firmware !== value) {
                this._firmware = value;
            }
        },
        get: function () {
            return this._firmware;
        }
    },
    _interface: {
        value: null
    },
    interface: {
        set: function (value) {
            if (this._interface !== value) {
                this._interface = value;
            }
        }, get: function () {
            return this._interface;
        }
    },
    _messages: {
        value: null
    },
    messages: {
        set: function (value) {
            if (this._messages !== value) {
                this._messages = value;
            }
        },
        get: function () {
            return this._messages;
        }
    },
    _model: {
        value: null
    },
    model: {
        set: function (value) {
            if (this._model !== value) {
                this._model = value;
            }
        },
        get: function () {
            return this._model;
        }
    },
    _smart_capable: {
        value: null
    },
    smart_capable: {
        set: function (value) {
            if (this._smart_capable !== value) {
                this._smart_capable = value;
            }
        },
        get: function () {
            return this._smart_capable;
        }
    },
    _smart_enabled: {
        value: null
    },
    smart_enabled: {
        set: function (value) {
            if (this._smart_enabled !== value) {
                this._smart_enabled = value;
            }
        },
        get: function () {
            return this._smart_enabled;
        }
    },
    _smart_status: {
        value: null
    },
    smart_status: {
        set: function (value) {
            if (this._smart_status !== value) {
                this._smart_status = value;
            }
        },
        get: function () {
            return this._smart_status;
        }
    },
    _temperature: {
        value: null
    },
    temperature: {
        set: function (value) {
            if (this._temperature !== value) {
                this._temperature = value;
            }
        },
        get: function () {
            return this._temperature;
        }
    },
    _test_capabilities: {
        value: null
    },
    test_capabilities: {
        set: function (value) {
            if (this._test_capabilities !== value) {
                this._test_capabilities = value;
            }
        },
        get: function () {
            return this._test_capabilities;
        }
    },
    _tests: {
        value: null
    },
    tests: {
        set: function (value) {
            if (this._tests !== value) {
                this._tests = value;
            }
        },
        get: function () {
            return this._tests;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "attributes",
            valueType: "array"
        }, {
            mandatory: false,
            name: "diagnostics",
            valueType: "object"
        }, {
            mandatory: false,
            name: "firmware",
            valueType: "String"
        }, {
            mandatory: false,
            name: "interface",
            valueType: "String"
        }, {
            mandatory: false,
            name: "messages",
            valueType: "array"
        }, {
            mandatory: false,
            name: "model",
            valueType: "String"
        }, {
            mandatory: false,
            name: "smart_capable",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "smart_enabled",
            valueType: "boolean"
        }, {
            mandatory: false,
            name: "smart_status",
            valueType: "String"
        }, {
            mandatory: false,
            name: "temperature",
            valueType: "number"
        }, {
            mandatory: false,
            name: "test_capabilities",
            valueObjectPrototypeName: "SupportedSmartTests",
            valueType: "object"
        }, {
            mandatory: false,
            name: "tests",
            valueType: "array"
        }]
    }
});
