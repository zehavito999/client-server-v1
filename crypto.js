var CryptoJS = require("crypto-js");
function encryptPsw(password){
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), 'increpted key 987');
    var ciphertext= ciphertext.toString();
    return ciphertext;
}

function decryptPsw(ciphertext){
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'increpted key 987');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}

module.exports.encryptPsw = encryptPsw;
module.exports.decryptPsw = decryptPsw;