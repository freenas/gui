#!/usr/bin/env node

var program = require('commander');
var cleanMontageDataCache = require('../lib/clean-cache').cleanMontageDataCache;
var MontageDataConfig = require("../configuration/montage-data-config").MontageDataConfig;


program
    .version('0.0.1')
    .parse(process.argv);


cleanMontageDataCache(
    MontageDataConfig.EnumerationsDirectoryAbsolutePath,
    MontageDataConfig.DescriptorsDirectoryAbsolutePath).catch(function (error) {
    console.log(error);

    process.exit(1);

}).finally(function () {
    console.log("Cleaning up montage data cache done!");

    process.exit(0);
});
