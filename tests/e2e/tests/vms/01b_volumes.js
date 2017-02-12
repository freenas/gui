module.exports = {
    'Create vm - volumes': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .InspectorOption[data-montage-id=volumeDevices]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Volumes');
    },
    'Create vm - Create volume - choose type': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New Volume');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceVolume').to.be.present.before(1000);
    }
};
