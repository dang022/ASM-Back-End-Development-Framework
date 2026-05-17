import Cart from '../models/Cart.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ status: 200, data: cart });
  } catch (e) { next(e); }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx > -1) cart.items[idx].quantity += Number(quantity);
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    res.json({ status: 200, data: cart });
  } catch (e) { next(e); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ status: 404, message: 'Cart not found' });
    const idx = cart.items.findIndex(i => i.product.toString() === productId);
    if (idx === -1) return res.status(404).json({ status: 404, message: 'Item not found' });
    cart.items[idx].quantity = quantity;
    await cart.save();
    res.json({ status: 200, data: cart });
  } catch (e) { next(e); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ status: 404, message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    res.json({ status: 200, data: cart });
  } catch (e) { next(e); }
};
