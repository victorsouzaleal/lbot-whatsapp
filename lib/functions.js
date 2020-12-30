const emoji = require('emoji-regex')


const emojiStrip = (string) => {
    return string.replace(emoji, '')
}


const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


exports.emojiStrip = emojiStrip
exports.sleep = sleep
