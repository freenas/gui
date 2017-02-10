module.exports = {
    'Create peer - choose type': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Peers');
    },
    'Create peer - freenas': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Peer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer .Inspector-header').text.to.equal('New freenas');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer div.FreenasCredentials').to.be.present.before(1000);
    },
    'Create peer - ssh': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Peer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer .Inspector-header').text.to.equal('New ssh');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer div.SshCredentials').to.be.present.before(1000);
    },
    'Create peer - vmware': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Peer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer .Inspector-header').text.to.equal('New vmware');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer div.VmwareCredentials').to.be.present.before(1000);
    },
    'Create peer - amazon-s3': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Viewer')
            .press('.CascadingListItem:nth-child(2) div.Viewer .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.Peer');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer .Inspector-header').text.to.equal('New amazon-s3');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Peer div.AmazonS3Credentials').to.be.present.before(1000);
    }
};
