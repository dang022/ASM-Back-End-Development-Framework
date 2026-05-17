import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart } from '../controllers/cartController.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCartItem);
router.delete('/remove/:productId', auth, removeFromCart);

export default router;
