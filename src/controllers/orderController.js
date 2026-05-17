import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

export const createOrder = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ status: 400, message: 'Cart empty' });
    const items = cart.items.map(i => ({ product: i.product._id, quantity: i.quantity, price: i.product.price }));
    const total = items.reduce((s, it) => s + it.quantity * it.price, 0);
    const order = await Order.create({ user: req.user._id, items, total });
    cart.items = [];
    await cart.save();
    res.status(201).json({ status: 201, data: order });
  } catch (e) { next(e); }
};

export const listOrders = async (req, res, next) => {
  try { const orders = await Order.find({ user: req.user._id }); res.json({ status: 200, data: orders }); } catch (e) { next(e); }
};

export const getOrder = async (req, res, next) => {
  try { const order = await Order.findById(req.params.id); res.json({ status: 200, data: order }); } catch (e) { next(e); }
};

export const updateStatus = async (req, res, next) => {
  try { const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }); res.json({ status: 200, data: order }); } catch (e) { next(e); }
};
