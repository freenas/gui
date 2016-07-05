var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.Scrub = AbstractModel.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/scrub.reel'
            },
            nameExpression: "'Scrub'"
        }
    }
});
