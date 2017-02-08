module.exports = {
    'Create share': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Viewer .Viewer-title').text.to.equal('Shares');
    },
    'Create share - SMB': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share .Inspector-header').text.to.equal('New SMB share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share div.SmbShare').to.be.present.before(1000);
    },
    'Create share - NFS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share .Inspector-header').text.to.equal('New NFS share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share div.NfsShare').to.be.present.before(1000);
    },
    'Create share - AFP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share .Inspector-header').text.to.equal('New AFP share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share div.AfpShare').to.be.present.before(1000);
    },
    'Create share - ISCSI': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share .Inspector-header').text.to.equal('New ISCSI share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share div.IScsiShare').to.be.present.before(1000);
    },
    'Create share - WEBDAV': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Viewer')
            .press('.CascadingListItem:nth-child(4) div.Viewer .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.Share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share .Inspector-header').text.to.equal('New WEBDAV share');
        browser.expect.element('.CascadingListItem:nth-child(4) div.Share div.WebdavShare').to.be.present.before(1000);
    }
};
