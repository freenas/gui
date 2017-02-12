module.exports = {
    'Interface': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.NetworkInterface');
    }
};
