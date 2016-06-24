var Montage = require("montage/core/core").Montage;
var VolumeSnapshotPropertyClones = require("core/model/models/volume-snapshot-property-clones").VolumeSnapshotPropertyClones;
var VolumeSnapshotPropertyCompressratio = require("core/model/models/volume-snapshot-property-compressratio").VolumeSnapshotPropertyCompressratio;
var VolumeSnapshotPropertyCreation = require("core/model/models/volume-snapshot-property-creation").VolumeSnapshotPropertyCreation;
var VolumeSnapshotPropertyReferenced = require("core/model/models/volume-snapshot-property-referenced").VolumeSnapshotPropertyReferenced;
var VolumeSnapshotPropertyUsed = require("core/model/models/volume-snapshot-property-used").VolumeSnapshotPropertyUsed;

exports.VolumeSnapshotProperties = Montage.specialize({
    _clones: {
        value: null
    },
    clones: {
        set: function (value) {
            if (this._clones !== value) {
                this._clones = value;
            }
        },
        get: function () {
            return this._clones || (this._clones = new VolumeSnapshotPropertyClones());
        }
    },
    _compressratio: {
        value: null
    },
    compressratio: {
        set: function (value) {
            if (this._compressratio !== value) {
                this._compressratio = value;
            }
        },
        get: function () {
            return this._compressratio || (this._compressratio = new VolumeSnapshotPropertyCompressratio());
        }
    },
    _creation: {
        value: null
    },
    creation: {
        set: function (value) {
            if (this._creation !== value) {
                this._creation = value;
            }
        },
        get: function () {
            return this._creation || (this._creation = new VolumeSnapshotPropertyCreation());
        }
    },
    _referenced: {
        value: null
    },
    referenced: {
        set: function (value) {
            if (this._referenced !== value) {
                this._referenced = value;
            }
        },
        get: function () {
            return this._referenced || (this._referenced = new VolumeSnapshotPropertyReferenced());
        }
    },
    _used: {
        value: null
    },
    used: {
        set: function (value) {
            if (this._used !== value) {
                this._used = value;
            }
        },
        get: function () {
            return this._used || (this._used = new VolumeSnapshotPropertyUsed());
        }
    }
});
