module.exports = {
    'Support': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(13)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.support');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Support .Inspector-header').text.to.equal('Support').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Support').to.be.present.before(5000);
    }
};
