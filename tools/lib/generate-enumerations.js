var FS = require('./fs-promise');
var EnumerationFactory = require('./factory/enumeration-factory');
var Connect = require('./backend/connect');
var Promise = require('montage/core/promise').Promise;

exports.generateEnumerations = function generateEnumerations (options) {
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
                                enumerations = [],
                                schema,
                                schemaKey;

                            for (var i = 0, length = schemaKeys.length; i < length; i++) {
                                schemaKey = schemaKeys[i];
                                schema = schemas[schemaKey];

                                if (schema.enum) {
                                    enumerations.push(EnumerationFactory.createEnumerationWithNameAndValues(schemaKey, schema.enum));
                                }
                            }

                            if (options.save) {
                                return EnumerationFactory.saveEnumerationsAtPath(enumerations, targetPath);
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
