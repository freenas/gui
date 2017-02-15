module.exports = {
    'Alerts & Reporting': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(8)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.alert');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Alerts & Reporting').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Alert').to.be.present.before(1000);
    }
};
