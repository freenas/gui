module.exports = {
    'Snapshots': function(browser) {
        browser
            .press('div[data-montage-id=snapshots]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .pause(250);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Snapshots');
    },
    'Create snapshot': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Snapshot');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Snapshot .Inspector-header').text.to.equal('Create a snapshot');
    }
};
