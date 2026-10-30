import User from '../models/User.js';
import { verifyToken } from '../utils/token.js';

/**
 * Middleware to authenticate requests using JWT Bearer token
 */
export const auth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.',
      });
    }

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User account associated with this token no longer exists.',
        });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token. Please log in again.',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to restrict access to administrator users only
 */
export const requireAdmin = (req, res, next) => {
  const role = req.user?.role?.toUpperCase();
  if (!req.user || role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Administrator privileges required.',
    });
  }
  next();
};

/**
 * Middleware to restrict access based on allowed roles
 * @param  {...string} roles
 */
export const requireRoles = (...roles) => {
  const normalized = roles.map((r) => r.toUpperCase());
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase();
    if (!req.user || !normalized.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

/**
 * Middleware to ensure student account is verified
 */
export const requireVerified = (req, res, next) => {
  if (!req.user || req.user.verificationStatus !== 'verified') {
    return res.status(403).json({
      success: false,
      error: 'Access denied. Account email/identity verification is pending or rejected.',
    });
  }
  next();
};
