module.exports = {
    'System': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('System');
    },
    'View system user': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .UserIcon:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.User');
    },
    'View system group': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .GroupIcon:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Group');
    }
};
