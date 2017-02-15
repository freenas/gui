module.exports = {
    'Accounts': function(browser) {
        browser
            .press('div.MainNavigationItem-accounts')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.SectionRoot', 5000)
            .pause(250);

        browser.expect.element('div.SectionRoot-entries .Viewer-title').text.to.equal('Accounts');
    }
};
