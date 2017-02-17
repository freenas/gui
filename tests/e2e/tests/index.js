var fs = require('fs'),
    _ = require('lodash');

var steps = {
    '00 - Login': function(browser) {
        browser
            .refresh()
            .url(browser.launchUrl)
            .waitForElementVisible('div[data-montage-id=signIn].SignIn', 10000)
            .setValue('input[data-montage-id=userName]', 'root')
            .setValue('input[data-montage-id=password]', 'root')
            .press('button[data-montage-id=submit].SignIn-submit')
            .waitForElementVisible('div.SystemInfo', 5000);
    }
};

_.forEach(
    _.shuffle(fs.readdirSync(__dirname)),
    function(section) {
        console.log(section);
        if (section.indexOf('.js') === -1) {
            var sectionSteps = require('./' + section);
            _.forEach(sectionSteps, function(value, key) {
                if (!_.startsWith(key, '99') && !_.startsWith(key, '00'))
                steps[section + ' / ' + key] = value;
            });
        }
    }
);
_.assign(steps, {
    '99 - End of test': function(browser) {
        browser
            .pause(250)
            .end();
    }
});

module.exports = steps;
