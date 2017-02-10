var fs = require('fs'),
    _ = require('lodash');

var steps = {};
_.forEach(
    _.sortBy(fs.readdirSync(__dirname)),
    function(section) {
        console.log(section);
        if (section.indexOf('.js') === -1) {
            var sectionSteps = require('./' + section);
            _.forEach(sectionSteps, function(value, key) {
                steps[section + ' / ' + key] = value;
            });
        }
    }
);

module.exports = steps;
