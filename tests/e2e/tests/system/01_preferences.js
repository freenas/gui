module.exports = {
    'Preferences': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.preferences');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Preferences').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Preferences').to.be.present.before(5000);
    }
};
