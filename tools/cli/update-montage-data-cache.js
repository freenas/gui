#!/usr/bin/env node

var program = require('commander');
var MontageDataConfig = require("../configuration/montage-data-config").MontageDataConfig;
var ProgressBar = require('progress');
var Connect = require('../lib/backend/connect');

var cleanMontageDataCache = require('../lib/clean-cache').cleanMontageDataCache;
var generateDescriptors = require("../lib/generate-descriptors").generateDescriptors;
var generateEnumerations = require("../lib/generate-enumerations").generateEnumerations;
var generateModel = require("../lib/generate-model").generateModel;
var generateServices = require("../lib/generate-services").generateServices;
var generateEventTypesForEntities = require("../lib/generate-events").generateEventTypesForEntities;
var generateModels = require("../lib/generate-models").generateModels;


program
    .version('0.0.3')
    .option('-u, --username <username>', 'username that will be used to establish a connection with the middleware')
    .option('-p, --password <password>', 'password that will be used to establish a connection with the middleware')
    .option('-H, --host <host>', 'host that will be used to establish a connection with the middleware')
    .option('-P, --port <port>', 'port that will be used to establish a connection with the middleware')
    .option('-v, --verbose', "enable the verbose mode")
    .option('-w, --warning', "log warning messages")
    .option('-s, --secure', "establish a secure connection with the middleware")
    .parse(process.argv);

global.verbose = program.verbose;
global.warning = program.warning;
program.save = true;

Connect.authenticateIfNeeded(program.username, program.password, program).then(function () {
    var progressBar = new ProgressBar('processing [:bar] :percent :etas', { total: 7 });

    return cleanMontageDataCache(
        MontageDataConfig.EnumerationsDirectoryAbsolutePath,
        MontageDataConfig.DescriptorsDirectoryAbsolutePath,
        MontageDataConfig.ModelsDirectoryAbsolutePath
    ).then(function () {
        progressBar.tick();
        program.target = MontageDataConfig.ModelDirectoryAbsolutePath;

        return generateServices(program).then(function () {
            progressBar.tick();
            program.target = MontageDataConfig.DescriptorsDirectoryAbsolutePath;

            return generateDescriptors(program).then(function () {
                progressBar.tick();
                program.target = MontageDataConfig.EnumerationsDirectoryAbsolutePath;

                return generateEnumerations(program).then(function () {
                    progressBar.tick();
                    program.target = MontageDataConfig.ModelsDirectoryAbsolutePath;

                    return generateModels([
                            MontageDataConfig.DescriptorsDirectoryAbsolutePath,
                            MontageDataConfig.CustomDescriptorsAbsolutePath
                        ], program, MontageDataConfig.UserInterfaceDescriptorDirectoryAbsolutePath).then(function () {
                        progressBar.tick();
                        program.target = MontageDataConfig.ModelDirectoryAbsolutePath;

                        return generateModel(
                            [
                                MontageDataConfig.ModelsDirectoryAbsolutePath
                            ],
                            program
                        ).then(function () {
                            progressBar.tick();
                            program.target = MontageDataConfig.ModelDirectoryAbsolutePath;

                            return generateEventTypesForEntities(program).then(function () {
                                progressBar.tick();
                                program.target = MontageDataConfig.ModelsDirectoryAbsolutePath;

                                return null;
                            });
                        });
                    });
                });
            });
        });
    });
}).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("Updating montage-data cache done!");

    process.exit(0);
});
