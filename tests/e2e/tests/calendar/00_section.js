module.exports = {
    'Calendar': function(browser) {
        browser
            .refresh()
            .url(browser.launchUrl)
            .waitForElementVisible('div[data-montage-id=signIn].SignIn', 10000)
            .setValue('input[data-montage-id=userName]', 'root')
            .setValue('input[data-montage-id=password]', 'root')
            .press('button[data-montage-id=submit].SignIn-submit')
            .waitForElementVisible('div.SystemInfo', 5000)
            .press('div.MainNavigationItem-calendar')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.Calendar', 5000)
            .pause(250);
    }
};
