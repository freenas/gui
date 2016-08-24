var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.DirectoryServices = AbstractModel.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/directory-services.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/directory-services.reel'
            },
            nameExpression: "'Directory Services'"
        }
    }
});
