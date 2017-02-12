module.exports = {
    'Language & Region': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(5)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.language-and-region');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Language & Region').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.LanguageAndRegion').to.be.present.before(1000);
    }
};
