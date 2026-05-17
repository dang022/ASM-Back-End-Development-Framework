import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const registerSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await User.findOne({ email: data.email });
    if (exists) return res.status(400).json({ status: 400, message: 'Email exists' });
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashed });
    res.status(201).json({ status: 201, data: { id: user._id, email: user.email, name: user.name } });
  } catch (err) { next(err); }
};

function signToken(user) { return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }); }

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email });
    if (!user) return res.status(400).json({ status: 400, message: 'Invalid credentials' });
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return res.status(400).json({ status: 400, message: 'Invalid credentials' });
    const token = signToken(user);
    res.json({ status: 200, token });
  } catch (err) { next(err); }
};

export const getProfile = (req, res) => {
  res.json({ status: 200, data: req.user });
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ status: 404, message: 'Not found' });
    user.name = req.body.name || user.name;
    await user.save();
    res.json({ status: 200, data: user });
  } catch (err) { next(err); }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ status: 200, data: users });
  } catch (err) { next(err); }
};
