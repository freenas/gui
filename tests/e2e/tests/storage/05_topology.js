module.exports = {
    'Topology': function(browser) {
        browser
            .press('div[data-montage-id=topology]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.TopologyEdit');
        browser.expect.element('.CascadingListItem:nth-child(3) div.TopologyEdit .Inspector-header').text.to.equal('Topology');
    },
    'Disk': function(browser) {
        browser
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DiskIcon')
            .press('.CascadingListItem:nth-child(3) div.DiskIcon:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Disk');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Disk .Inspector-header').text.to.contain('/dev/');
    }
};
