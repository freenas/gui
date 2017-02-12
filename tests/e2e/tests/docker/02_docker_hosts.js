module.exports = {
    'Docker Hosts': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Docker Hosts');
    },
    'Create Docker host': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DockerHost');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DockerHost .Inspector-header').text.to.equal('');
    }
};
