const stackParser = require('stacktrace-parser')

module.exports = level => {
    return stackParser.parse(new Error().stack)[level]
}
