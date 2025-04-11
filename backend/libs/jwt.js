const crypto = require('crypto')

const generateToken = (adminId) => {
    var randomByte = crypto.randomBytes(16).toString("base64");

    var salt = Buffer.from(randomByte, "base64");
    return crypto.pbkdf2Sync(adminId, salt, 10000, 64, "sha1").toString("base64");
};

module.exports = { generateToken };