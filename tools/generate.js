#!/usr/bin/env node

var program = require('commander');

program
    .version('0.0.1')
    .command('descriptors', 'generate descriptor files from the middleware schemas')
    .alias('desc')
    .parse(process.argv);
