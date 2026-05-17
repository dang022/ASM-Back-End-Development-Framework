import express from 'express';
import { register, login, getProfile, updateProfile, getUsers } from '../controllers/authController.js';
import { auth, admin } from '../middlewares/auth.js';
const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register
 */
router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', auth, admin, getUsers);

export default router;
