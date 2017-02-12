module.exports = {
    'Containers': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Containers');
    },
    'Create container - choose collection': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Collections');
    },
    'Create container - container': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.ContainerCreator');
        browser.expect.element('.CascadingListItem:nth-child(3) div.ContainerCreator .Inspector-header').text.to.equal('Create a container');
    }
};
