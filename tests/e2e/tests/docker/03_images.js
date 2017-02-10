module.exports = {
    'Images': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Images');
    },
    'Pull image - choose collection': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Collections');
    },
    'Pull image - choose image': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DockerImagePull');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DockerImagePull .Inspector-header').text.to.equal('Pull an image');
    }
};
