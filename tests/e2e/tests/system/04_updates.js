module.exports = {
    'Updates': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.updates');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Updates').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Updates').to.be.present.before(1000);
    }
};
