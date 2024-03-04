
if (process.env.MODE !== 'development')
    require('dotenv').config()

const key = process.env.ENCRYPT_KEY;

const crypto = require('crypto');
const encryptionKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


// Middleware function to encrypt the response data
function encryptResponse(req, res, next) {
    const originalSend = res.send;
    res.send = function(data) {

        // Convert the response data to a string
        const responseDataString = JSON.stringify(data);
        console.log("encrypting")

        // Create a cipher using AES encryption algorithm with CBC mode
        const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

        // Encrypt the response data
        let encryptedData = cipher.update(responseDataString, 'utf8', 'hex');
        encryptedData += cipher.final('hex');



        // Set the encrypted response data
        res.set('Content-Type', 'application/json');
        originalSend.call(res, { iv: iv.toString('hex'), encryptedData });
    };

    next();
}

module.exports = encryptResponse