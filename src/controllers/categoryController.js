import Category from '../models/Category.js';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(1), description: z.string().optional() });

export const list = async (req, res, next) => {
  try { const cats = await Category.find(); res.json({ status: 200, data: cats }); } catch (e) { next(e); }
};
export const create = async (req, res, next) => {
  try { const body = schema.parse(req.body); const c = await Category.create(body); res.status(201).json({ status: 201, data: c }); } catch (e) { next(e); }
};
export const update = async (req, res, next) => {
  try { const body = schema.partial().parse(req.body); const c = await Category.findByIdAndUpdate(req.params.id, body, { new: true }); res.json({ status: 200, data: c }); } catch (e) { next(e); }
};
export const remove = async (req, res, next) => {
  try { await Category.findByIdAndDelete(req.params.id); res.json({ status: 200, message: 'Deleted' }); } catch (e) { next(e); }
};
