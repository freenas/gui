var Montage = require("montage").Montage;

exports.OpenFile = Montage.specialize({
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
    _pid: {
        value: null
    },
    pid: {
        set: function (value) {
            if (this._pid !== value) {
                this._pid = value;
            }
        },
        get: function () {
            return this._pid;
        }
    },
    _process_name: {
        value: null
    },
    process_name: {
        set: function (value) {
            if (this._process_name !== value) {
                this._process_name = value;
            }
        },
        get: function () {
            return this._process_name;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "path",
            valueType: "String"
        }, {
            mandatory: false,
            name: "pid",
            valueType: "number"
        }, {
            mandatory: false,
            name: "process_name",
            valueType: "String"
        }]
    }
});
