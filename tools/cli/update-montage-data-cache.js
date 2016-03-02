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


program
    .version('0.0.1')
    .parse(process.argv);


Connect.authenticateIfNeeded().then(function () {
    var progressBar = new ProgressBar('processing [:bar] :percent :etas', { total: 5 });

    return cleanMontageDataCache(
        MontageDataConfig.EnumerationsDirectoryAbsolutePath,
        MontageDataConfig.DescriptorsDirectoryAbsolutePath).then(function () {
        progressBar.tick();

        return generateServices({
            target: MontageDataConfig.ModelDirectoryAbsolutePath,
            save: true
        }).then(function () {
            progressBar.tick();

            return generateDescriptors({
                target: MontageDataConfig.DescriptorsDirectoryAbsolutePath,
                save: true
            }).then(function () {
                progressBar.tick();

                return generateEnumerations({
                    target: MontageDataConfig.EnumerationsDirectoryAbsolutePath,
                    save: true
                }).then(function () {
                    progressBar.tick();

                    return generateModel(MontageDataConfig.DescriptorsDirectoryAbsolutePath, {
                        prefix: MontageDataConfig.DescriptorsDirectoryPath,
                        target: MontageDataConfig.ModelDirectoryAbsolutePath,
                        save: true
                    }).then(function () {
                        progressBar.tick();

                        return null;
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
