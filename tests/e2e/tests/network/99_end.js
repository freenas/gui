module.exports = {
    'End of test': function(browser) {
        browser
            .pause(250)
            .end();
    }
};
