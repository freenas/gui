module.exports = {
    'Users': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Users');
    },
    'Create user': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.User');
        browser.expect.element('.CascadingListItem:nth-child(3) div.User .Inspector-header').text.to.equal('Create a user');
    }
};
