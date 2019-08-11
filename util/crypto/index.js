const charPool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const charPoolLength = charPool.length;

const createRandomString = (len = 24) => {
  const charArray = [];

  for (let i = 0; i < len; i++) {
    charArray.push(charPool.charAt(Math.floor(Math.random() * charPoolLength)));
  }

  return charArray.join('');
}

module.exports = {
  createRandomString,
};
