const errorHandler = require('../controllers/errorHandler');

const isAllowed = role => allowed.indexOf(role) >= 0;

/**
 * Checks if a user object exists on the request object.
 */
const protect = () => {
  return (req, res, next) => {
    if (!req.user) {
      // no permission
      return next(errorHandler.createError(403, 'No permission to access this resource'));
    }
  
    next();
  }
};

const permit = (...allowed) => {
  return (req, res, next) => {
    if (!req.user || !isAllowed(req.user.role)) {
      // no permission
      return next(errorHandler.createError(403, 'No permission to access this resource'));
    }

    next();
  }
};

module.exports.permit = permit;
module.exports.protect = protect;
