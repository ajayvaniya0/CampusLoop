import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
} from '../controllers/authController.js';
import { auth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected student routes
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.post('/profile', auth, updateProfile);

// Admin-only test/guard route
router.get('/admin-check', auth, requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access verified',
    user: req.user,
  });
});

export default router;
