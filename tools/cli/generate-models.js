#!/usr/bin/env node
var MontageDataConfig = require("../configuration/montage-data-config").MontageDataConfig,
    generateModels = require("../lib/generate-models").generateModels,
    program = require('commander'),
    descriptorsDirectory = MontageDataConfig.DescriptorsDirectoryAbsolutePath;


program
    .version('0.0.7')
    .arguments('<model_directory>')
    .action(function (model_directory) {
        descriptorsDirectory = model_directory;
    })
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-t, --target <target>', "changes the default target directory")
    .option('--no-save', "does not save descriptor files")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;

program.target = program.target || MontageDataConfig.ModelsDirectoryAbsolutePath;


generateModels(descriptorsDirectory, program).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("Models files generated!");

    process.exit(0);
});
