module.exports = {
    'Import media': function(browser) {
        browser
            .press('div.SectionRoot-extraEntries .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.VolumeMediaImporter');
        browser.expect.element('.CascadingListItem:nth-child(2) div.VolumeMediaImporter .Inspector-header').text.to.equal('Import media in volume');
    }
};
