module.exports = {
    'Create volume': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.VolumeCreator');
        browser.expect.element('.CascadingListItem:nth-child(2) div.VolumeCreator .Inspector-header').text.to.equal('Create a volume');
    },
/*
    'Disk': function() {
        browser
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.DiskIcon')
            .press('.CascadingListItem:nth-child(2) div.DiskIcon:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Disk');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Disk .Inspector-header').text.to.contain('/dev/');
    },
*/
    'Volume': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.SectionRoot-entries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Volume');
    }
};
