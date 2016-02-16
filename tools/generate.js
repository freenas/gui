#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.5')
    .command('descriptors', 'generate descriptor files from the middleware schemas')
    .command('models', 'generate the models file for a given path')
    .alias('desc')
    .parse(process.argv);
