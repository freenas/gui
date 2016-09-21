var Montage = require("montage").Montage;

exports.ImportableDisk = Montage.specialize({
    _fstype: {
        value: null
    },
    fstype: {
        set: function (value) {
            if (this._fstype !== value) {
                this._fstype = value;
            }
        },
        get: function () {
            return this._fstype;
        }
    },
    _label: {
        value: null
    },
    label: {
        set: function (value) {
            if (this._label !== value) {
                this._label = value;
            }
        },
        get: function () {
            return this._label;
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
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "fstype",
            valueType: "String"
        }, {
            mandatory: false,
            name: "label",
            valueType: "String"
        }, {
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "size",
            valueType: "number"
        }]
    }
});
