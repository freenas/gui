module.exports = {
    'Create certificate': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Certificates');
    },
    'Create interface - Import CA': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(1)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Import CA');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateImport').to.be.present.before(2000);
    },
    'Create interface - Intermediate CA': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(2)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Create Intermediate CA');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateCreation').to.be.present.before(2000);
    },
    'Create interface - Internal CA': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(3)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Create Internal CA');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateCreation').to.be.present.before(2000);
    },
    'Create interface - Signing Request': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(4)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Create Signing Request');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateCreation').to.be.present.before(2000);
    },
    'Create interface - Import Certificate': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Import Certificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateImport').to.be.present.before(2000);
    },
    'Create interface - Internal Certificate': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer')
            .press('.CascadingListItem:nth-child(3) div.Viewer .List-item:nth-child(6)')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.CryptoCertificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate .Inspector-header').text.to.equal('Create Internal Certificate');
        browser.expect.element('.CascadingListItem:nth-child(3) div.CryptoCertificate div.CryptoCertificateCreation').to.be.present.before(2000);
    }
};
