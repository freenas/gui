var Montage = require("montage").Montage;

exports.DirectoryServices = Montage.specialize(null, {
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
