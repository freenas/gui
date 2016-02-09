#!/usr/bin/env node

var program = require('commander');
var prompt = require('prompt');
var Path = require('path');
var FS = require('fs');
var ModelDescriptorFactory = require('./lib/model-descriptor-factory');
var WebSocketClient = require('./lib/websocket-client').WebSocketClient;
var WebSocketConfiguration = require('../core/backend/websocket-configuration').WebSocketConfiguration;
var Promise = require('montage/core/promise').Promise;

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
    .version('0.0.1')
    .option('-u, --username [username]', 'username')
    .option('-p, --password [password]', 'password')
    .option('-H, --host <host>', 'set the host by default freenas.local')
    .option('-P, --port <port>', 'port')
    .option('-v, --verbose', 'verbose')
    .option('-s, --secure', 'secure')
    .option('-t, --target <target>', 'target')
    .parse(process.argv);


global.verbose = !!program.verbose;


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
    getTargetPath(program.target).then(function (targetPath) {
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
                            schemaKey,
                            descriptor;

                        for (var i = 0, length = schemaKeys.length; i < length; i++) {
                            schemaKey = schemaKeys[i];
                            descriptor = ModelDescriptorFactory.createModelDescriptorWithSchema(schemaKey, schemas[schemaKey]);

                            if (descriptor) {
                                descriptors.push(descriptor);
                            }
                        }

                        return ModelDescriptorFactory.saveModelDescriptorsAtPath(descriptors, targetPath);
                    }
                });
            });
        });
    }).catch(function (error) {
        console.log(error);

        process.exit(1);

    }).finally(function () {
        process.exit(0);
    });
}


function getTargetPath (path) {
    return new Promise(function (resolve, reject) {
        path = Path.join(process.cwd(), path || '');

        FS.stat(path, function (error, stats) {
            if (error) {
                reject(error);
                return;
            }

            if (stats.isDirectory()) {
                resolve(path);

            } else {
                reject(new Error("the target can't be a file!"));
            }
        });
    });
}
