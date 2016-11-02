var Montage = require("montage").Montage;

exports.EncryptedVolumeImporter = Montage.specialize({
    _key: {
        value: null
    },
    key: {
        set: function (value) {
            if (this._key !== value) {
                this._key = value;
            }
        },
        get: function () {
            return this._key;
        }
    },
    _disks: {
        value: null
    },
    disks: {
        set: function (value) {
            if (this._disks !== value) {
                this._disks = value;
            }
        },
        get: function () {
            return this._disks;
        }
    }
}, {
    propertyBlueprints: {
        value: [{
            mandatory: false,
            name: "key"
        }, {
            mandatory: false,
            name: "disks"
        }]
    },
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/encrypted-volume-importer.reel'
            },
            nameExpression: "'Import an encrypted volume'"
        }
    }
});
