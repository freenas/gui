#!/usr/bin/env node

var program = require('commander');
var FS = require('./lib/fs-promise');
var Path = require('path');

var modelDirectory;

require('../core/extras/string');
require('montage/core/extras/string');

program
    .version('0.0.2')
    .arguments('<model_directory>')
    .action(function (model_directory) {
        modelDirectory = model_directory;
    })
    .option('-p, --prefix <prefix>', "prefix for the moduleId path")
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-t, --target <target>', "changes the default target directory")
    .parse(process.argv);


global.verbose = !!program.verbose;
global.warning = !!program.warning;


if (modelDirectory) {
    _generateModels(modelDirectory);

} else {
    console.log("the model directory path is missing!");

    process.exit(1);
}

function _generateModels (path) {
    return FS.listDirectoryAtPath(path).then(function (files) {
        var modelsFile = {
                models: []
            },
            models = modelsFile.models,
            file;

        for (var i = 0, length = files.length; i < length; i++) {
            file = files[i];

            var format = Path.parse(file);

            if (format.ext === ".mjson") {
                models.push({
                    type: format.name.toCamelCase(),
                    modelId: program.prefix ? Path.join(program.prefix, file) : file
                });
            }
        }

        var targetPath = program.target;

        return FS.getAbsolutePath(targetPath).then(function (absoluteTarget) {
            return FS.isDirectoryAtPath(absoluteTarget).then(function (isDirectoryAtPath) {
                if (isDirectoryAtPath) {
                    targetPath = Path.join(absoluteTarget, "models.mjson");
                }

                return FS.writeFileAtPathWithData(targetPath, JSON.stringify(modelsFile, null, 4));
            });
        });

    }).catch(function (error) {
        console.log(error);

        process.exit(1);

    }).finally(function () {
        console.log("Job Done!");

        process.exit(0);
    });
}
