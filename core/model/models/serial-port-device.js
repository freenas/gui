var Montage = require("montage").Montage;

exports.SerialPortDevice = Montage.specialize({
    _description: {
        value: null
    },
    description: {
        set: function (value) {
            if (this._description !== value) {
                this._description = value;
            }
        },
        get: function () {
            return this._description;
        }
    },
    _drivername: {
        value: null
    },
    drivername: {
        set: function (value) {
            if (this._drivername !== value) {
                this._drivername = value;
            }
        },
        get: function () {
            return this._drivername;
        }
    },
    _location: {
        value: null
    },
    location: {
        set: function (value) {
            if (this._location !== value) {
                this._location = value;
            }
        },
        get: function () {
            return this._location;
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
    _size: {
        value: null
    },
    size: {
        set: function (value) {
            if (this._size !== value) {
                this._size = value;
            }
        },
        get: function () {
            return this._size;
        }
    },
    _start: {
        value: null
    },
    start: {
        set: function (value) {
            if (this._start !== value) {
                this._start = value;
            }
        },
        get: function () {
            return this._start;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "description",
            valueType: "String"
        }, {
            mandatory: false,
            name: "drivername",
            valueType: "String"
        }, {
            mandatory: false,
            name: "location",
            valueType: "String"
        }, {
            mandatory: false,
            name: "name",
            valueType: "String"
        }, {
            mandatory: false,
            name: "size",
            valueType: "String"
        }, {
            mandatory: false,
            name: "start",
            valueType: "String"
        }]
    }
});
