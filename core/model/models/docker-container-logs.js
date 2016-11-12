var Montage = require("montage").Montage;

exports.DockerContainerLogs = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-logs.reel'
            },
            nameExpression: "'Logs'"
        }
    }
});
