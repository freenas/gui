module.exports = {
    'Datastores': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) div.SectionRoot-extraEntries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Datastores');
    },
    'Create datastore - type': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Datastores');
    },
    'Create datastore - NFS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.VirtualMachineDatastore');
        browser.expect.element('.CascadingListItem:nth-child(3) div.VirtualMachineDatastore .Inspector-header').text.to.equal('New NFS Datastore');
        browser.expect.element('.CascadingListItem:nth-child(3) div.VirtualMachineDatastore div.VirtualMachineDatastoreNfs').to.be.present.before(5000);
    }
};
