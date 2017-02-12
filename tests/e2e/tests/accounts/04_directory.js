module.exports = {
    'Directory services': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.DirectoryServices');
        browser.expect.element('.CascadingListItem:nth-child(2) div.DirectoryServices .Inspector-header').text.to.equal('Directory services');
    },
    'Configure AD': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DirectoryService');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService .Inspector-header').text.to.equal('Active Directory');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService div.WinbindService').to.be.present.before(1000);
    },
    'Configure IPA': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DirectoryService');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService .Inspector-header').text.to.equal('FreeIPA');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService div.FreeipaService').to.be.present.before(1000);
    },
    'Configure LDAP': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DirectoryService');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService .Inspector-header').text.to.equal('LDAP');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService div.LdapService').to.be.present.before(1000);
    },
    'Configure NIS': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.DirectoryService');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService .Inspector-header').text.to.equal('NIS');
        browser.expect.element('.CascadingListItem:nth-child(3) div.DirectoryService div.NisService').to.be.present.before(1000);
    }
};
