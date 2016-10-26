var Montage = require("montage").Montage;

exports.VolumeImporter = Montage.specialize(null, {
    userInterfaceDescriptor: {
        value: {
            inspectorComponentModule: {
                id: 'ui/sections/storage/inspectors/volume-importer.reel'
            },
            nameExpression: "'Import volumes'"
        }
    }
});
