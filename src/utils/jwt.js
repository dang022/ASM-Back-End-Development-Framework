import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt.js';
dotenv.config();
export const sign = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
