module.exports = {
    'Create vm': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.VirtualMachine');
        browser.expect.element('.CascadingListItem:nth-child(2) div.VirtualMachine .Inspector-header').text.to.equal('New VM');
    },
    'Create vm - readme': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .InspectorOption[data-montage-id=readme]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.VirtualMachineReadme');
    }
};
