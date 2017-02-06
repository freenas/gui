#!/usr/bin/env node
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

if (process.argv.length < 4) {
    console.log(
        'USAGE:',
        '\n' + process.argv[1], '<schema.json> <target_directory>'
    );
    process.exit(1);
}

var defs = require(process.argv[2]).args.definitions,
    enums = _.filter(
        _.toPairs(defs),
        x => _.has(x[1], 'enum')
    );

_.forEach(
    _.map(
        enums,
        x => [
            x[0],
            _.join([
                'const ' + x[0] + ' = {',
                _.join(
                    _.map(
                        x[1].enum,
                        value => "    " + value + ": '" + value + "' as '" + value + "'"
                    ),
                    ',\n'
                ),
                '};',
                'type ' + x[0] + ' = (typeof ' + x[0] + ')[keyof typeof ' + x[0] + '];',
                'export {' + x[0] + ';'
                ],
                '\n'
            )
        ]
    ),
    y => {
        fs.writeFileSync(path.join(process.argv[3], y[0] + '.ts'), y[1])
    }
);
/*
    [x[0], 'const ' + x[0] + ' = {' +
                _.map(x[1].enum, (y) => '\n    ' + y + ": '" + y + "' as '" + y + "'") + '\n};\ntype ' + x[0] + ' = (typeof ' + x[0] + ')[keyof typeof ' + x[0] + '];\nexport {' + x[0] + '};\n']), (x) => fs.writeFileSync('enumerations/' + x[0] + '.ts', x[1]))
*/
