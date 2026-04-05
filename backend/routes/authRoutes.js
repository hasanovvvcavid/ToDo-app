import express from 'express';
import {
  registerUser,
  verifyEmail,
  loginUser,
  googleAuth
} from '../controllers/authController.js';

const router = express.Router();

// Email / Password route-ları
router.post('/register', registerUser);
router.get('/verify/:token', verifyEmail);
router.post('/login', loginUser);

// Google Auth route-u
router.post('/google', googleAuth);

export default router;
