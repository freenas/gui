module.exports = {
    'Console': function(browser) {
        browser
            .press('div.MainNavigationItem-console')
            .waitForElementVisible('div.Console-terminal', 5000)
            .pause(250);
    }
};
