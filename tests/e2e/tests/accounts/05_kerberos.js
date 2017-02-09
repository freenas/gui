module.exports = {
    'Kerberos realms': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Kerberos Realms');
    },
    'Create kerberos realm': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.KerberosRealm');
        browser.expect.element('.CascadingListItem:nth-child(4) div.KerberosRealm .Inspector-header').text.to.equal('');
    },
    'Kerberos tabs': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) .DirectoryServices-body .List-item:nth-child(6)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Kerberos Tabs');
    },
    'Create kerberos tab': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(3) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(4) div.KerberosKeytab');
        browser.expect.element('.CascadingListItem:nth-child(4) div.KerberosKeytab .Inspector-header').text.to.equal('');
    }
};
