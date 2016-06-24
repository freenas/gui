var Montage = require("montage/core/core").Montage;

exports.DiskPartition = Montage.specialize({
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
    _mediasize: {
        value: null
    },
    mediasize: {
        set: function (value) {
            if (this._mediasize !== value) {
                this._mediasize = value;
            }
        },
        get: function () {
            return this._mediasize;
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
    _paths: {
        value: null
    },
    paths: {
        set: function (value) {
            if (this._paths !== value) {
                this._paths = value;
            }
        },
        get: function () {
            return this._paths;
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
    _uuid: {
        value: null
    },
    uuid: {
        set: function (value) {
            if (this._uuid !== value) {
                this._uuid = value;
            }
        },
        get: function () {
            return this._uuid;
        }
    }
});
