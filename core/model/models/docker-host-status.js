var Montage = require("montage").Montage;

exports.DockerHostStatus = Montage.specialize({
    _hostname: {
        value: null
    },
    hostname: {
        set: function (value) {
            if (this._hostname !== value) {
                this._hostname = value;
            }
        },
        get: function () {
            return this._hostname;
        }
    },
    _mem_total: {
        value: null
    },
    mem_total: {
        set: function (value) {
            if (this._mem_total !== value) {
                this._mem_total = value;
            }
        },
        get: function () {
            return this._mem_total;
        }
    },
    _os: {
        value: null
    },
    os: {
        set: function (value) {
            if (this._os !== value) {
                this._os = value;
            }
        },
        get: function () {
            return this._os;
        }
    },
    _unique_id: {
        value: null
    },
    unique_id: {
        set: function (value) {
            if (this._unique_id !== value) {
                this._unique_id = value;
            }
        },
        get: function () {
            return this._unique_id;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "hostname",
            valueType: "String"
        }, {
            mandatory: false,
            name: "mem_total",
            valueType: "number"
        }, {
            mandatory: false,
            name: "os",
            valueType: "String"
        }, {
            mandatory: false,
            name: "unique_id",
            valueType: "String"
        }]
    }
});
