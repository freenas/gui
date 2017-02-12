module.exports = {
    'Storage': function(browser) {
        browser
            .press('div.MainNavigationItem-storage')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.SectionRoot', 5000)
            .pause(250);

        browser.expect.element('div.SectionRoot .Inspector-header').text.to.equal('Storage');
    }
};
