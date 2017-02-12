module.exports = {
    'Create scrub': ''+function(browser) {
        browser
            .waitForElementVisible('div.DayColumn.is-today')
            .pause(1000)
            .moveToElement('div.type-volume_scrub', 10, 10)
            .mouseButtonDown(0)
            .pause(1000)
            .moveTo(null, 0, 300)
            .pause(1000)
            .mouseButtonUp(0)
            .pause(2000);
    }
};
