#!/usr/bin/env node
var compileFromFile = require('json-schema-to-typescript').compileFromFile,
    ws = require('ws'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('../../node_modules/montage/node_modules/bluebird'),
    _ = require('lodash');

var socket = new ws('http://pch-mini.local/dispatcher/socket');

socket.on('open', function() {
    socket.send('{"namespace":"rpc","id":"login","name":"auth","args":{"username":"root","password":"root"}}');
});

socket.on('message', function(rawMessage) {
    var message = JSON.parse(rawMessage);
    if (message.namespace === 'rpc' && message.name === 'response') {
        if (message.id === 'login') {
            socket.send('{"namespace":"rpc","id":"get_schema","name":"call","args":{"method":"discovery.get_schema","args":null}}');
        } else if (message.id === 'get_schema') {
            compileToTs(message.args.definitions);
        }
    }
});

function compileToTs(definitions) {
    var tmpDir = fs.mkdtempSync('/tmp/gui-model-'),
        classPaths = [],
        tmpDestination = path.join(tmpDir, 'model.d.ts');
    console.log(tmpDestination);
    _.forEach(definitions, function(definition, className) {
        var classPath = path.join(tmpDir, className);
        fs.writeFileSync(classPath, JSON.stringify(definition)
            .replace('{"$ref":"permissions"}', '{"$ref":"Permissions"}')
            .replace('{"$ref":"neighbod-type"}', '"string"')
            .replace(/\{"\$ref":"ipv4-address"}/g, '{"$ref":"Ipv4Address"}')
            .replace(/\{"\$ref":"unix-permissions"}/g, '{"$ref":"UnixPermissions"}')
            .replace(/\{"\$ref":"vm"}/g, '{"$ref":"Vm"}')
            .replace(/\{"\$ref":"datasets-replication-pair"}/g, '{"$ref":"DatasetsReplicationPair"}')
        );
        classPaths.push(classPath);
    });
/*
    var exclude = [
        'Volume',
        'ZfsDataset',
        'ZfsPool',
        'ZfsTopology',
        'ZfsVdev',
        'ZfsVdevExtension'
    ];
    _.forEach(_.sortBy(classPaths), function(classPath) {
        if (!_.includes(exclude, _.tail(_.split(classPath, '/')))) {
            compileFromFile(classPath).then(function(result) {
                console.log(classPath);
                fs.appendFileSync(tmpDestination, result);
                fs.appendFileSync(tmpDestination, '\n');
            }, function(error) {
                console.log(classPath, error);
            });
        }
    });
*/
}
