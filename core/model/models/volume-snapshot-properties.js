var Montage = require("montage").Montage;

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
            return this._clones;
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
            return this._compressratio;
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
            return this._creation;
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
            return this._referenced;
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
            return this._used;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "clones",
            valueObjectPrototypeName: "VolumeSnapshotPropertyClones",
            valueType: "object"
        }, {
            mandatory: false,
            name: "compressratio",
            valueObjectPrototypeName: "VolumeSnapshotPropertyCompressratio",
            valueType: "object"
        }, {
            mandatory: false,
            name: "creation",
            valueObjectPrototypeName: "VolumeSnapshotPropertyCreation",
            valueType: "object"
        }, {
            mandatory: false,
            name: "referenced",
            valueObjectPrototypeName: "VolumeSnapshotPropertyReferenced",
            valueType: "object"
        }, {
            mandatory: false,
            name: "used",
            valueObjectPrototypeName: "VolumeSnapshotPropertyUsed",
            valueType: "object"
        }]
    }
});
