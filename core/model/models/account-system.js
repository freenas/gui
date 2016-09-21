var Montage = require("montage").Montage;

exports.AccountSystem = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            collectionInspectorComponentModule: {
                id: 'ui/controls/viewer.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/freenas-icon.reel'
            },
            collectionNameExpression: "'System'"
        }
    }
});
