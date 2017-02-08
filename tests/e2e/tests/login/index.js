module.exports = {
    'Login': function (browser) {
        browser
            .url(browser.launchUrl)
            .waitForElementVisible('div[data-montage-id=signIn].SignIn', 10000)
            .setValue('input[data-montage-id=userName]', 'root')
            .setValue('input[data-montage-id=password]', 'root')
            .press('button[data-montage-id=submit].SignIn-submit')
            .waitForElementVisible('div.SystemInfo', 5000)
            .end();
    }
};
