module.exports = {
    'Groups': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Groups');
    },
    'Create group': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Group');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Group .Inspector-header').text.to.equal('Create a group');
    }
};
