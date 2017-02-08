module.exports = {
    'Shares': function(browser) {
        browser
            .press('div[data-montage-id=shares]')
            .waitForElementVisible('.CascadingListItem:nth-child(3) div.Viewer');
        browser.expect.element('.CascadingListItem:nth-child(3) div.Viewer .Viewer-title').text.to.equal('Shares');
    }
};
