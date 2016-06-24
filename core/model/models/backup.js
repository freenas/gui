var Montage = require("montage/core/core").Montage;

exports.Backup = Montage.specialize({
    _compression: {
        value: null
    },
    compression: {
        set: function (value) {
            if (this._compression !== value) {
                this._compression = value;
            }
        },
        get: function () {
            return this._compression;
        }
    },
    _dataset: {
        value: null
    },
    dataset: {
        set: function (value) {
            if (this._dataset !== value) {
                this._dataset = value;
            }
        },
        get: function () {
            return this._dataset;
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
    _properties: {
        value: null
    },
    properties: {
        set: function (value) {
            if (this._properties !== value) {
                this._properties = value;
            }
        },
        get: function () {
            return this._properties;
        }
    },
    _provider: {
        value: null
    },
    provider: {
        set: function (value) {
            if (this._provider !== value) {
                this._provider = value;
            }
        },
        get: function () {
            return this._provider;
        }
    },
    _recursive: {
        value: null
    },
    recursive: {
        set: function (value) {
            if (this._recursive !== value) {
                this._recursive = value;
            }
        },
        get: function () {
            return this._recursive;
        }
    }
});
