const jwt = require('jwt-simple');
const config = require('../../../config');
const cryptoUtil = require('../../../util/crypto');

const issueAccessToken = (user) => {
  const now = Math.round((+ new Date()) / 1000);

  const jti = cryptoUtil.createRandomString(24);
  const iss = config.app.id;
  const sub = user.id;
  const iat = now;
  const exp = now + (60 * 60);  // 3600 seconds = 1 hour

  const token = { 
    jti,
    iss,
    sub,
    iat,
    exp,
  };

  return jwt.encode(token, config.token.secret);
};

const decodeToken = (encodedToken) => {
  return jwt.decode(encodedToken, config.token.secret);
};

const validateToken = (token) => {
  // note: expiration check is done by jwt-simple library
  let valid = true;

  // check app id
  if (!token.iss || token.iss !== config.app.id) {
    valid = false;
  }

  return valid;
};

const getToken = (user) => {
  const accessToken = issueAccessToken(user);

  return {
    accessToken,
  };
}

module.exports = {
  decodeToken,
  getToken,
  validateToken,
}
