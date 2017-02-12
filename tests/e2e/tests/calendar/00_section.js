module.exports = {
    'Calendar': function(browser) {
        browser
            .press('div.MainNavigationItem-calendar')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.Calendar', 5000)
            .pause(250);
    }
};
