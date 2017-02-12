module.exports = {
    'Certificates': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(7)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.certificates');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Certificates').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Certificates').to.be.present.before(1000);
    }
};
