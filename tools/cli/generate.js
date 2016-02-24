#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.7')
    .command('descriptors', 'generate descriptor files from the middleware schemas')
    .command('model', 'generate the model file for a given path')
    .command('services', 'generate the services file for a given path')
    .command('enumerations', 'generate the enumeration files for a given path')
    .alias('desc')
    .parse(process.argv);
