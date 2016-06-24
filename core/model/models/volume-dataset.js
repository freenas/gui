var Montage = require("montage/core/core").Montage;
var Permissions = require("core/model/models/permissions").Permissions;
var VolumeDatasetProperties = require("core/model/models/volume-dataset-properties").VolumeDatasetProperties;

exports.VolumeDataset = Montage.specialize({
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
    _mounted: {
        value: null
    },
    mounted: {
        set: function (value) {
            if (this._mounted !== value) {
                this._mounted = value;
            }
        },
        get: function () {
            return this._mounted;
        }
    },
    _mountpoint: {
        value: null
    },
    mountpoint: {
        set: function (value) {
            if (this._mountpoint !== value) {
                this._mountpoint = value;
            }
        },
        get: function () {
            return this._mountpoint;
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
    _permissions: {
        value: null
    },
    permissions: {
        set: function (value) {
            if (this._permissions !== value) {
                this._permissions = value;
            }
        },
        get: function () {
            return this._permissions || (this._permissions = new Permissions());
        }
    },
    _permissions_type: {
        value: null
    },
    permissions_type: {
        set: function (value) {
            if (this._permissions_type !== value) {
                this._permissions_type = value;
            }
        },
        get: function () {
            return this._permissions_type;
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
            return this._properties || (this._properties = new VolumeDatasetProperties());
        }
    },
    _rname: {
        value: null
    },
    rname: {
        set: function (value) {
            if (this._rname !== value) {
                this._rname = value;
            }
        },
        get: function () {
            return this._rname;
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
    _volsize: {
        value: null
    },
    volsize: {
        set: function (value) {
            if (this._volsize !== value) {
                this._volsize = value;
            }
        },
        get: function () {
            return this._volsize;
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
