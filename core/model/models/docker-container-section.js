var Montage = require("montage").Montage;

exports.DockerContainerSection = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            nameExpression: "'Containers'"
        }
    }
});
