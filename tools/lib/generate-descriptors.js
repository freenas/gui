var FS = require('./fs-promise');
var ModelDescriptorFactory = require('./factory/model-descriptor-factory');
var Connect = require('./backend/connect');
var Promise = require('montage/core/promise').Promise;


exports.generateDescriptors = function generateDescriptors (options) {
    return Connect.authenticateIfNeeded(options.username, options.password, options).then(function (websocket) {
        return FS.getAbsolutePath(options.target).then(function (targetPath) {
            return FS.isDirectoryAtPath(targetPath).then(function (isDirectoryAtPath) {
                if (isDirectoryAtPath) {
                    return websocket.send("rpc", "call", {
                        method: "discovery.get_schema",
                        args: []

                    }).then(function (response) {
                        var schemas = response.args.definitions;

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
                                return ModelDescriptorFactory.saveModelDescriptorsAtPath(descriptors, targetPath);
                            }

                            return Promise.resolve();
                        }
                    });
                } else {
                    throw new Error("not a directory");
                }
            });
        })
    });
};
