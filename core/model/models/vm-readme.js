var Montage = require("montage").Montage;

exports.VmReadme = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/inspectors/virtual-machine.reel/virtual-machine-readme.reel'
            },
            nameExpression: "'Readme'"
        }
    }
});
