module.exports = {
    'Datasets': function(browser) {
        browser
            .press('div[data-montage-id=datasets]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Datasets');
    },
    'Create dataset': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VolumeDataset');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VolumeDataset .Inspector-header').text.to.equal('');
    }
};
