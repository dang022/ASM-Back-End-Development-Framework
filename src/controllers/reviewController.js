import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const r = await Review.create({ product: productId, user: req.user._id, rating, comment });
    // update product stats
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, x) => s + x.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avg, numReviews: reviews.length });
    res.status(201).json({ status: 201, data: r });
  } catch (e) { next(e); }
};

export const listReviews = async (req, res, next) => {
  try { const reviews = await Review.find({ product: req.params.id }).populate('user', 'name'); res.json({ status: 200, data: reviews }); } catch (e) { next(e); }
};
