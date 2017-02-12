module.exports = {
    'Replications': function(browser) {
        browser
            .press('div[data-montage-id=replications]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .pause(250);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Replications');
    },
    'Create replication': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Replication');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Replication .Inspector-header').text.to.equal('');
    }
};
