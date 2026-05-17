import Product from '../models/Product.js';
import { z } from 'zod';

const schema = z.object({ name: z.string(), description: z.string().optional(), price: z.number(), stock: z.number().optional(), category: z.string().optional() });

export const list = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (search) filter.name = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const items = await Product.find(filter).skip(skip).limit(Number(limit)).populate('category');
    res.json({ status: 200, data: items });
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try { const p = await Product.findById(req.params.id).populate('category'); res.json({ status: 200, data: p }); } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try { const body = schema.parse(req.body); const p = await Product.create(body); res.status(201).json({ status: 201, data: p }); } catch (e) { next(e); }
};
export const update = async (req, res, next) => {
  try { const body = schema.partial().parse(req.body); const p = await Product.findByIdAndUpdate(req.params.id, body, { new: true }); res.json({ status: 200, data: p }); } catch (e) { next(e); }
};
export const remove = async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ status: 200, message: 'Deleted' }); } catch (e) { next(e); }
};
