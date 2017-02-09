module.exports = {
    'Management': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.ServicesCategory');
        browser.expect.element('.CascadingListItem:nth-child(2) div.ServicesCategory .Inspector-header').text.to.equal('Management').before(5000);
    },
    'Management - DC': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('DC').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.DcService').to.be.present.before(1000);
    },
    'Management - DYNDNS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('DYNDNS').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.DynDnsService').to.be.present.before(1000);
    },
    'Management - LLDP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('LLDP').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.LldpService').to.be.present.before(1000);
    },
    'Management - SNMP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('SNMP').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.SnmpService').to.be.present.before(1000);
    },
    'Management - SSHD': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('SSHD').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.SshdService').to.be.present.before(1000);
    },
    'Management - UPS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.ServicesCategory .List-item:nth-child(6)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Service');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service .Inspector-header').text.to.equal('UPS').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(3) div.Service div.Ups').to.be.present.before(1000);
    }
};
