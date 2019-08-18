const CryptoJS = require('crypto-js');

const charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charPoolLength = charPool.length;

const createRandomString = (len = 24) => {
  const charArray = [];

  for (let i = 0; i < len; i++) {
    charArray.push(charPool.charAt(Math.floor(Math.random() * charPoolLength)));
  }

  return charArray.join('');
};

const getObjectHashSha256 = obj => {
  return CryptoJS.SHA256(JSON.stringify(obj)).toString(CryptoJS.enc.Base64);
};

const encodeBase64 = str => {
  if (typeof str === 'object') {
    str = JSON.stringify(str);
  }

  const parsedWord = CryptoJS.enc.Utf8.parse(str);
  return CryptoJS.enc.Base64.stringify(parsedWord);
};

const decodeBase64 = encodedStr => {
  const encodedWord = CryptoJS.enc.Base64.parse(encodedStr);
  const decodedStr = CryptoJS.enc.Utf8.stringify(encodedWord);

  try {
    return JSON.parse(decodedStr);
  } catch {
    return decodedStr;
  }
};

module.exports = {
  createRandomString,
  decodeBase64,
  encodeBase64,
  getObjectHashSha256,
};
