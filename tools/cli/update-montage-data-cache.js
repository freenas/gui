#!/usr/bin/env node

var program = require('commander');
var cleanMontageDataCache = require('../lib/clean-cache').cleanMontageDataCache;
var generateDescriptors = require("../lib/generate-descriptors").generateDescriptors;
var generateEnumerations = require("../lib/generate-enumerations").generateEnumerations;
var generateModel = require("../lib/generate-model").generateModel;
var MontageDataConfig = require("../configuration/montage-data-config").MontageDataConfig;

program
    .version('0.0.1')
    .parse(process.argv);


cleanMontageDataCache(
    MontageDataConfig.EnumerationsDirectoryAbsolutePath,
    MontageDataConfig.DescriptorsDirectoryAbsolutePath).then(function () {

    return generateDescriptors({
        target: MontageDataConfig.DescriptorsDirectoryAbsolutePath,
        save: true
    }).then(function () {
        return generateEnumerations({
            target: MontageDataConfig.EnumerationsDirectoryAbsolutePath,
            save: true
        }).then(function () {
            return generateModel(MontageDataConfig.DescriptorsDirectoryAbsolutePath, {
                prefix: MontageDataConfig.DescriptorsDirectoryPath,
                target: MontageDataConfig.ModelDirectoryAbsolutePath
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
