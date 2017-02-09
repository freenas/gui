module.exports = {
    'Create interface': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Interfaces');
    },
    'Create interface - VLAN': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.NetworkInterface');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface .Inspector-header').text.to.equal('New VLAN');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface div.Vlan').to.be.present.before(1000);
    },
    'Create interface - LAGG': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.NetworkInterface');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface .Inspector-header').text.to.equal('New LAGG');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface div.Lagg').to.be.present.before(1000);
    },
    'Create interface - BRIDGE': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.NetworkInterface');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface .Inspector-header').text.to.equal('New BRIDGE');
        browser.expect.element('.CascadingListItem:nth-child(2) div.NetworkInterface div.Bridge').to.be.present.before(1000);
    }
};
