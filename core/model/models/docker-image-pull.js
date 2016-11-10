var Montage = require("montage").Montage;

exports.DockerImagePull = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            nameExpression: "'Pull a Image'",
            inspectorComponentModule: {
                id: 'ui/sections/containers/inspectors/docker-image-pull.reel'
            }
        }
    }
});
