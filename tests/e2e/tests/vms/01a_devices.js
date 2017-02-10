module.exports = {
    'Create vm - devices': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .InspectorOption[data-montage-id=devices]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Devices');
    },
    'Create vm - Create device - choose type': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Viewer .Viewer-title').text.to.equal('Devices');
    },
    'Create vm - Create device - DISK': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New DISK Device');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceDisk').to.be.present.before(1000);
    },
    'Create vm - Create device - CDROM': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New CDROM Device');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceCdrom').to.be.present.before(1000);
    },
    'Create vm - Create device - NIC': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New NIC Device');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceNic').to.be.present.before(1000);
    },
    'Create vm - Create device - GRAPHICS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New GRAPHICS Device');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceGraphics').to.be.present.before(1000);
    },
    'Create vm - Create device - USB': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.VirtualMachineDevice');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice .Inspector-header').text.to.equal('New USB Device');
        browser.expect.element('.CascadingListItem:nth-child(4) div.VirtualMachineDevice div.VirtualMachineDeviceUsb').to.be.present.before(1000);
    }
};
