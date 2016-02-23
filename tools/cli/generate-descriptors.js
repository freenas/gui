#!/usr/bin/env node

var program = require('commander');
var generateDescriptors = require("../lib/generate-descriptors").generateDescriptors;


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


generateDescriptors(program).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("Descriptors files generated!");

    process.exit(0);
});
