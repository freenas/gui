var Montage = require("montage").Montage;

exports.DockerVolume = Montage.specialize({
    _container_path: {
        value: null
    },
    container_path: {
        set: function (value) {
            if (this._container_path !== value) {
                this._container_path = value;
            }
        },
        get: function () {
            return this._container_path;
        }
    },
    _host_path: {
        value: null
    },
    host_path: {
        set: function (value) {
            if (this._host_path !== value) {
                this._host_path = value;
            }
        },
        get: function () {
            return this._host_path;
        }
    },
    _readonly: {
        value: null
    },
    readonly: {
        set: function (value) {
            if (this._readonly !== value) {
                this._readonly = value;
            }
        },
        get: function () {
            return this._readonly;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "container_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "host_path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "readonly",
            valueType: "boolean"
        }]
    }
});
