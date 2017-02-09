module.exports = {
    'Overview': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.overview');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Overview').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Overview').to.be.present.before(5000);
    }
};
