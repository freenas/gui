var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Calendar = AbstractModel.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/calendar.reel'
            },
            nameExpression: "'Calendar'"
        }
    }
});
