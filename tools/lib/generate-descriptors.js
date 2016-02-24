var FS = require('./fs-promise');
var ModelDescriptorFactory = require('./factory/model-descriptor-factory');
var Promise = require('montage/core/promise').Promise;
var Service = require('./backend/service');


exports.generateDescriptors = function generateDescriptors (options) {
    return Service.findSchemas(options).then(function (schemas) {
        if (schemas) {
            var schemaKeys = Object.keys(schemas),
                descriptors = [],
                tmpDescriptors,
                schemaKey;

            for (var i = 0, length = schemaKeys.length; i < length; i++) {
                schemaKey = schemaKeys[i];

                tmpDescriptors = ModelDescriptorFactory.createModelDescriptorsWithNameAndSchema(schemaKey, schemas[schemaKey]);

                if (tmpDescriptors) {
                    descriptors = descriptors.concat(tmpDescriptors);
                }
            }

            if (options.save) {
                return FS.getAbsolutePath(options.target).then(function (targetPath) {
                    return FS.isDirectoryAtPath(targetPath).then(function (isDirectoryAtPath) {
                        if (isDirectoryAtPath) {
                            return ModelDescriptorFactory.saveModelDescriptorsAtPath(descriptors, targetPath);
                        }

                        throw new Error("not a directory");
                    });
                });
            }
        }

        return Promise.resolve();
    });
};
