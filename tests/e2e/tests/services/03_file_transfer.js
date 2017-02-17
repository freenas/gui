module.exports = {
    'File Transfer': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.ServicesCategory');
        browser.expect.element('.CascadingListItem:nth-child(2) div.ServicesCategory .Inspector-header').text.to.equal('File Transfer').before(5000);
    },
    'File Transfer - FTP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('FTP').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.FtpService').to.be.present.before(5000);
    },
    'File Transfer - RSYNCD': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('RSYNCD').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.RsyncdService').to.be.present.before(5000);
    },
    'File Transfer - TFTPD': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('TFTPD').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.TftpdService').to.be.present.before(5000);
    }
};
