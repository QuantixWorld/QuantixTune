function generateRandomString(length) {
    let result = "";
    let possibilites = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

    for (let i = 0; i < length; i++) {
        result += possibilites.charAt(Math.floor(Math.random() * possibilites.length))
    }

    return result;
}

module.exports = { generateRandomString }