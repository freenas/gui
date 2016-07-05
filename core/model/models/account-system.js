var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.AccountSystem = AbstractModel.specialize(null, {
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
