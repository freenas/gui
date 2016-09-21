var Montage = require("montage").Montage;

exports.Calendar = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/calendar.reel'
            },
            nameExpression: "'Calendar'"
        }
    }
});
