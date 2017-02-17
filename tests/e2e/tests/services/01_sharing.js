module.exports = {
    'Sharing': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.ServicesCategory')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(1)', 5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.ServicesCategory .Inspector-header').text.to.equal('Sharing').before(5000);
    },
    'Sharing - AFP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('AFP').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.AfpService').to.be.present.before(5000);
    },
    'Sharing - ISCSI': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('ISCSI').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.IscsiService').to.be.present.before(5000);
    },
    'Sharing - NFS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('NFS').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.NfsService').to.be.present.before(5000);
    },
    'Sharing - SMB': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('SMB').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.SmbService').to.be.present.before(5000);
    },
    'Sharing - WEBDAV': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('WEBDAV').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.WebdavService').to.be.present.before(5000);
    }
};
