var fs = require('fs'),
    _ = require('lodash');

var steps = {};
_.forEach(
    _.initial(_.sortBy(fs.readdirSync(__dirname))),
    function(stepFile) {
        var step = require('./' + stepFile);

        _.assign(steps, step);
    }
);

module.exports = steps;
