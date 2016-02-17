#!/usr/bin/env node

var program = require('commander');
var FS = require('./lib/fs-promise');
var ModelDescriptorFactory = require('./lib/model-descriptor-factory');
var Connect = require('./lib/connect');


program
    .version('0.0.7')
    .option('-u, --username <username>', 'username that will be used to establish a connection with the middleware')
    .option('-p, --password <password>', 'password that will be used to establish a connection with the middleware')
    .option('-H, --host <host>', 'host that will be used to establish a connection with the middleware')
    .option('-P, --port <port>', 'port that will be used to establish a connection with the middleware')
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-s, --secure', "establish a secure connection with the middleware")
    .option('-t, --target <target>', "changes the default target directory")
    .option('--no-save', "does not save descriptor files")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;


Connect.authenticateIfNeeded(program.username, program.password, program).then(function (websocket) {
    return FS.getAbsolutePath(program.target).then(function (targetPath) {
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

                        if (program.save) {
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
}).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("Done!");

    process.exit(0);
});
