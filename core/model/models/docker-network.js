var Montage = require("montage").Montage;

exports.DockerNetwork = Montage.specialize({
    _driver: {
        value: null
    },
    driver: {
        set: function (value) {
            if (this._driver !== value) {
                this._driver = value;
            }
        },
        get: function () {
            return this._driver;
        }
    },
    _gateway: {
        value: null
    },
    gateway: {
        set: function (value) {
            if (this._gateway !== value) {
                this._gateway = value;
            }
        },
        get: function () {
            return this._gateway;
        }
    },
    _host: {
        value: null
    },
    host: {
        set: function (value) {
            if (this._host !== value) {
                this._host = value;
            }
        },
        get: function () {
            return this._host;
        }
    },
    _id: {
        value: null
    },
    id: {
        set: function (value) {
            if (this._id !== value) {
                this._id = value;
            }
        },
        get: function () {
            return this._id;
        }
    },
    _name: {
        value: null
    },
    name: {
        set: function (value) {
            if (this._name !== value) {
                this._name = value;
            }
        },
        get: function () {
            return this._name;
        }
    },
    _subnet: {
        value: null
    },
    subnet: {
        set: function (value) {
            if (this._subnet !== value) {
                this._subnet = value;
            }
        },
        get: function () {
            return this._subnet;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "driver",
            valueType: "String"
        }, {
            mandatory: false,
            name: "gateway",
            valueType: "String"
        }, {
            mandatory: false,
            name: "host",
            valueType: "String"
        }, {
            mandatory: false,
            name: "id",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "subnet",
            valueType: "String"
        }]
    }
});
