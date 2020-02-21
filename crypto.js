var CryptoJS = require("crypto-js");

function encryptPassword(password){
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), 'increpted key 987');
    var ciphertext= ciphertext.toString();
    return ciphertext;
}


function decryptPassword(ciphertext){
    var bytes  = CryptoJS.AES.decrypt(ciphertext, 'increpted key 987');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
}



module.exports.encryptPassword = encryptPassword;
module.exports.decryptPassword = decryptPassword;