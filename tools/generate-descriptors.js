#!/usr/bin/env node

var program = require('commander');
var prompt = require('prompt');
var FS = require('./lib/fs-promise');
var ModelDescriptorFactory = require('./lib/model-descriptor-factory');
var WebSocketClient = require('./lib/websocket-client').WebSocketClient;
var WebSocketConfiguration = require('../core/backend/websocket-configuration').WebSocketConfiguration;

var passwordSchema = {
        properties: {
            password: {
                hidden: true,
                required: true
            }
        }
    },

    loginSchema = {
        properties: {
            username: {
                required: true
            }
        }
    };


loginSchema.properties.password = passwordSchema.properties.password;


program
    .version('0.0.4')
    .option('-u, --username <username>', 'username that will be used to establish a connection with the middleware')
    .option('-p, --password <password>', 'password that will be used to establish a connection with the middleware')
    .option('-H, --host <host>', 'host that will be used to establish a connection with the middleware')
    .option('-P, --port <port>', 'port that will be used to establish a connection with the middleware')
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-s, --secure', "establish a secure connection with the middleware")
    .option('-t, --target <target>', "changes the default target directory")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;


if (!program.password || !program.username) {
    prompt.start();

    console.log("authentication required!");

    prompt.get(program.username ? passwordSchema : loginSchema, function (error, result) {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        if (!program.username) {
            program.username = result.username;
        }

        program.password = result.password;

        generateDescriptors();
    });

} else {
    generateDescriptors();
}


function generateDescriptors () {
    return FS.getAbsolutePath(program.target).then(function (targetPath) {
        return FS.isDirectoryAtPath(targetPath).then(function (isDirectoryAtPath) {
            if (isDirectoryAtPath) {
                var webSocketConfiguration = new WebSocketConfiguration();

                webSocketConfiguration.set(WebSocketConfiguration.KEYS.SECURE, !!program.secure);
                webSocketConfiguration.set(WebSocketConfiguration.KEYS.HOST, program.host || "freenas.local");
                webSocketConfiguration.set(WebSocketConfiguration.KEYS.PORT, program.port || "5000");
                webSocketConfiguration.set(WebSocketConfiguration.KEYS.PATH, "/socket");

                var websocket = new WebSocketClient(webSocketConfiguration);

                return websocket.connect().then(function () {
                    return websocket.authenticate(program.username, program.password).then(function () {
                        if (global.verbose) {
                            console.log("Used Connected");
                        }

                        return websocket.send("rpc", "call", {
                            method : "discovery.get_schema",
                            args : []

                        }).then(function (response) {
                            var schemas = response.args.definitions;

                            if (schemas) {
                                var schemaKeys = Object.keys(schemas),
                                    descriptors = [],
                                    schemaKey;

                                for (var i = 0, length = schemaKeys.length; i < length; i++) {
                                    schemaKey = schemaKeys[i];

                                    descriptors = descriptors.concat(
                                        ModelDescriptorFactory.createModelDescriptorsWithNameAndSchema(schemaKey, schemas[schemaKey])
                                    );
                                }

                                return ModelDescriptorFactory.saveModelDescriptorsAtPath(descriptors, targetPath);
                            }
                        });
                    });
                });
            } else {
                throw new Error("not a directory");
            }
        });

    }).catch(function (error) {
        console.log(error);

        process.exit(1);

    }).finally(function () {
        console.log("Done!");

        process.exit(0);
    });
}
