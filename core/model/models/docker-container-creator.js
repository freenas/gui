var Montage = require("montage").Montage;

exports.DockerContainerCreator = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/container-creator.reel'
            },
            nameExpression: "'Create a container'"
        }
    }
});
