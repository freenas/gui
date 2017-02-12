module.exports = {
    'Tunables': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(1) .SectionRoot-entries .List-item:nth-child(11)')
            .waitForElementVisible('.CascadingListItem:nth-child(2) div.SystemSection.tunables');
        browser.expect.element('.CascadingListItem:nth-child(2) div.Viewer .Viewer-title').text.to.equal('Tunables').before(1000);
        browser.expect.element('.CascadingListItem:nth-child(2) div.SystemSection div.Tunables').to.be.present.before(1000);
    },
    'Create a tunable': function(browser) {
        browser
            .press('.CascadingListItem:nth-child(2) div.Viewer .Viewer-createButton')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Tunable');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Tunable .Inspector-header').text.to.equal('Add a Tunable').before(1000);
    }
};
