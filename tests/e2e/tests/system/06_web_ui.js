module.exports = {
    'Web UI': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(6)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.web-ui');
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection .Inspector-header').text.to.equal('Web UI').before(5000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.WebUi').to.be.present.before(5000);
    }
};
