var Montage = require("montage").Montage;

exports.EncryptedVolumeActions = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/encrypted-volume-actions.reel'
            },
            nameExpression: "'Encrypted Actions'"
        }
    }
});
