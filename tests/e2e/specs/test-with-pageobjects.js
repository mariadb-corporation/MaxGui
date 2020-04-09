////////////////////////////////////////////////////////////////
// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
//
// For more information on working with page objects see:
//   https://nightwatchjs.org/guide/working-with-page-objects/
////////////////////////////////////////////////////////////////

module.exports = {
    beforeEach: browser => browser.init(),

    'e2e tests using page objects': browser => {
        const loginpage = browser.page.loginpage()
        loginpage.waitForElementVisible('@appContainer')

        const app = loginpage.section.app
        app.assert.elementCount('@logo', 1)
        app.expect.section('@welcome').to.be.visible
        app.expect.section('@headline').text.to.match(/^Welcome$/)

        browser.end()
    },

    'verify if string "e2e-nightwatch" is within the cli plugin links': browser => {
        const loginpage = browser.page.loginpage()
    },
}
