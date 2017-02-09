module.exports = {
    'Debug': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(10)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.debug');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Debug').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Debug').to.be.present.before(1000);
    }
};
