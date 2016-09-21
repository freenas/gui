var Montage = require("montage").Montage;

exports.Scrub = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/scrub.reel'
            },
            nameExpression: "'Scrub'"
        }
    }
});
