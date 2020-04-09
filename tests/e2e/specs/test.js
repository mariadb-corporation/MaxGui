// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
    'default e2e tests': browser => {
        browser
            .init()
            .waitForElementVisible('#app')
            .assert.elementPresent('.login-wrapper')
            .assert.containsText('span', 'MaxScale')
            .assert.elementCount('img', 1)
            .end()
    },

    'example e2e test using a custom command': browser => {
        browser
            .openLoginpage()
            .assert.elementPresent('.login-wrapper')
            .end()
    },
}
