module.exports = {
    'IPMIs': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-extraEntries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('IPMI');
    },
    'IPMI': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Ipmi');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Ipmi .Inspector-header').text.to.contains('IPMI Channel');
    }
};
