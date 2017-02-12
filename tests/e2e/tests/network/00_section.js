module.exports = {
    'Network': function(browser) {
        browser
            .press('div.MainNavigationItem-network')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.SectionRoot', 5000)
            .pause(250);

        browser.expect.element('div.SectionRoot .Inspector-header').text.to.equal('Network');
    }
};
