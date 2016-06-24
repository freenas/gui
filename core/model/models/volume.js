var Montage = require("montage/core/core").Montage;
var VolumeEncryption = require("core/model/models/volume-encryption").VolumeEncryption;
var VolumeProperties = require("core/model/models/volume-properties").VolumeProperties;
var ZfsScan = require("core/model/models/zfs-scan").ZfsScan;
var ZfsTopology = require("core/model/models/zfs-topology").ZfsTopology;

exports.Volume = Montage.specialize({
    _attributes: {
        value: null
    },
    attributes: {
        set: function (value) {
            if (this._attributes !== value) {
                this._attributes = value;
            }
        },
        get: function () {
            return this._attributes;
        }
    },
    _encrypted: {
        value: null
    },
    encrypted: {
        set: function (value) {
            if (this._encrypted !== value) {
                this._encrypted = value;
            }
        },
        get: function () {
            return this._encrypted;
        }
    },
    _encryption: {
        value: null
    },
    encryption: {
        set: function (value) {
            if (this._encryption !== value) {
                this._encryption = value;
            }
        },
        get: function () {
            return this._encryption || (this._encryption = new VolumeEncryption());
        }
    },
    _guid: {
        value: null
    },
    guid: {
        set: function (value) {
            if (this._guid !== value) {
                this._guid = value;
            }
        },
        get: function () {
            return this._guid;
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
    _params: {
        value: null
    },
    params: {
        set: function (value) {
            if (this._params !== value) {
                this._params = value;
            }
        },
        get: function () {
            return this._params;
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
            return this._properties || (this._properties = new VolumeProperties());
        }
    },
    _providers_presence: {
        value: null
    },
    providers_presence: {
        set: function (value) {
            if (this._providers_presence !== value) {
                this._providers_presence = value;
            }
        },
        get: function () {
            return this._providers_presence;
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
    _scan: {
        value: null
    },
    scan: {
        set: function (value) {
            if (this._scan !== value) {
                this._scan = value;
            }
        },
        get: function () {
            return this._scan || (this._scan = new ZfsScan());
        }
    },
    _topology: {
        value: null
    },
    topology: {
        set: function (value) {
            if (this._topology !== value) {
                this._topology = value;
            }
        },
        get: function () {
            return this._topology || (this._topology = new ZfsTopology());
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
    }
});
