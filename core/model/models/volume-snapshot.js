var Montage = require("montage/core/core").Montage;
var VolumeSnapshotProperties = require("core/model/models/volume-snapshot-properties").VolumeSnapshotProperties;

exports.VolumeSnapshot = Montage.specialize({
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
    _holds: {
        value: null
    },
    holds: {
        set: function (value) {
            if (this._holds !== value) {
                this._holds = value;
            }
        },
        get: function () {
            return this._holds;
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
    _lifetime: {
        value: null
    },
    lifetime: {
        set: function (value) {
            if (this._lifetime !== value) {
                this._lifetime = value;
            }
        },
        get: function () {
            return this._lifetime;
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
            return this._properties || (this._properties = new VolumeSnapshotProperties());
        }
    },
    _replicable: {
        value: null
    },
    replicable: {
        set: function (value) {
            if (this._replicable !== value) {
                this._replicable = value;
            }
        },
        get: function () {
            return this._replicable;
        }
    },
    _volume: {
        value: null
    },
    volume: {
        set: function (value) {
            if (this._volume !== value) {
                this._volume = value;
            }
        },
        get: function () {
            return this._volume;
        }
    }
});
