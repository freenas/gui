module.exports = {
    'Boot volume': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.boot-pool');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Boot Volume').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.BootPool').to.be.present.before(5000);
    }
};
