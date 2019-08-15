const errorHandler = require('../controllers/errorHandler');

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

module.exports.permit = permit;
module.exports.protect = protect;
