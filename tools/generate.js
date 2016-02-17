#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.7')
    .command('descriptors', 'generate descriptor files from the middleware schemas')
    .command('models', 'generate the model files for a given path')
    .command('enumerations', 'generate the enumeration files for a given path')
    .alias('desc')
    .parse(process.argv);
