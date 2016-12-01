var Montage = require("montage").Montage;

exports.DirectoryServices = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/accounts/inspectors/directory-services.reel'
            },
            iconComponentModule: {
                id: 'ui/icons/directory-services.reel'
            },
            nameExpression: "'Directory Services'",
            wizardComponentModuleId: "ui/sections/wizard/inspectors/directory-services.reel",
            wizardTitle: "Set up a directory service"
        }
    }
});
