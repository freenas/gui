module.exports = {
    'NTP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(12)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.ntpservers');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('NTP Servers').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Ntpservers').to.be.present.before(5000);
    },
    'Create an NTP server': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Ntpserver');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Ntpserver .Inspector-header').text.to.equal('Add an NTP Server').before(5000);
    }
};
