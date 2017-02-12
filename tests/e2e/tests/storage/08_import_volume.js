module.exports = {
    'Import volume': function(browser) {
        browser
            .press('div.SectionRoot-extraEntries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.VolumeImporter');
        browser.expect.element('.CascadingListItem:nth-child(2) div.VolumeImporter .Viewer-title').text.to.equal('Detached volumes');
    },
    'Import encrypted volume': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.VolumeImporter [data-montage-id=encrypted]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.EncryptedVolumeImporter');
        browser.expect.element('.CascadingListItem:nth-child(3) div.EncryptedVolumeImporter .Inspector-header').text.to.equal('Import an encrypted volume');
    }
};
