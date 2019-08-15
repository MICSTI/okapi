const jwt = require('jwt-simple');
const config = require('../../../config');
const cryptoUtil = require('../../../util/crypto');

const issueAccessToken = (user) => {
  const now = + new Date();

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

const getToken = (user) => {
  const accessToken = issueAccessToken(user);

  return {
    accessToken,
  };
}

module.exports = {
  getToken,
}
