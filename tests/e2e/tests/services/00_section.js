module.exports = {
    'Services': function(browser) {
        browser
            .press('div.MainNavigationItem-services')
            .waitForElementVisible('.CascadingListItem:nth-child(1) div.SectionRoot', 10000)
            .pause(250);

        browser.expect.element('div.SectionRoot-entries .Viewer-title').text.to.equal('Services Categories');
    }
};
