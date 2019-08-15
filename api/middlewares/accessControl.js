const errorHandler = require('../controllers/errorHandler');
const tokenService = require('../controllers/token');

/**
 * Checks if a user object exists on the request object.
 */
const protect = (req, res, next) => {
  if (!req.user) {
    // no permission
    return next(errorHandler.createError(403, 'No permission to access this resource'));
  }

  return next();
};

const permit = (...allowed) => (req, res, next) => {
  const isAllowed = role => allowed.indexOf(role) >= 0;

  if (!req.user || !isAllowed(req.user.role)) {
    // no permission
    return next(errorHandler.createError(403, 'No permission to access this resource'));
  }

  next();
};

const parseAuthToken = (req, res, next) => {
  // remove all previous req.user information
  if (req && req.user) {
    delete req.user;
  }

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substr('Bearer '.length);

  try {
    const jwt = tokenService.decodeToken(token);

    if (!tokenService.validateToken(jwt)) {
      throw new Error("Token validation failed");
    }
    
    req.user = {
      id: jwt.sub,
    };
  } catch (ex) {
    const message = ex.message || 'Invalid authentication token';
    return next(errorHandler.createError(401, message));
  }

  next();
};

module.exports = {
  parseAuthToken,
  permit,
  protect,
}
