var AbstractModel = require("core/model/abstract-model").AbstractModel;

exports.VmReadme = AbstractModel.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/virtual-machine.reel/virtual-machine-readme.reel'
            },
            nameExpression: "'Readme'"
        }
    }
});
