import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { JWT_SECRET } from '../config/jwt.js';
import { extractToken } from '../utils/jwt.js';
dotenv.config();

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ status: 401, message: 'No token' });
  const token = extractToken(authHeader);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ status: 401, message: 'Invalid token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else res.status(403).json({ status: 403, message: 'Admin only' });
};
