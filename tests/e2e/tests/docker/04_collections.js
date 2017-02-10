module.exports = {
    'Collections': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Collections');
    },
    'Collection': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DockerCollection');
    },
    'Create collection': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DockerCollection');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DockerCollection .Inspector-header').text.to.equal('Create a collection');
    }
};
