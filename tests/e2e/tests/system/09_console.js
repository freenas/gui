module.exports = {
    'Console': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(9)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.serial-console');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Console').before(2000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.SerialConsole').to.be.present.before(1000);
    }
};
