#!/usr/bin/env node

var program = require('commander');
var generateModel = require("../lib/generate-model").generateModel;

var modelDirectory;

require('../../core/extras/string');
require('montage/core/extras/string');

program
    .version('0.0.2')
    .arguments('<model_directory>')
    .action(function (model_directory) {
        modelDirectory = model_directory;
    })
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-t, --target <target>', "changes the default target directory")
    .option('--no-save', "do not save model file")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;


if (modelDirectory) {
    generateModel(modelDirectory, program).catch(function (error) {
        console.log(error);

        process.exit(1);

    }).finally(function () {
        console.log("model.mjson file generated!");

        process.exit(0);
    });

} else {
    console.log("the model directory path is missing!");

    process.exit(1);
}
