#!/usr/bin/env node

var program = require('commander');
var generateEventTypesForEntities = require("../lib/generate-events").generateEventTypesForEntities;

require('../../core/extras/string');
require('montage/core/extras/string');

program
    .version('0.0.1')
    .option('-u, --username <username>', 'username that will be used to establish a connection with the middleware')
    .option('-p, --password <password>', 'password that will be used to establish a connection with the middleware')
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('--no-save', "do not save services file")
    .option('-t, --target <target>', "changes the default target directory")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;


generateEventTypesForEntities(program).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("events.mjson file generated!");

    process.exit(0);
});
