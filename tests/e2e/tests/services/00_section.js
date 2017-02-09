module.exports = {
    'Services': function(browser) {
        browser
            .refresh()
            .url(browser.launchUrl)
            .waitForElementVisible('div[data-montage-id=signIn].SignIn', 10000)
            .setValue('input[data-montage-id=userName]', 'root')
            .setValue('input[data-montage-id=password]', 'root')
            .press('button[data-montage-id=submit].SignIn-submit')
            .waitForElementVisible('div.SystemInfo', 5000)
            .press('div.MainNavigationItem-services')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.SectionRoot', 10000)
            .pause(250);

        browser.expect.element('div.SectionRoot-entries .Viewer-title').text.to.equal('Services Categories');
    }
};
