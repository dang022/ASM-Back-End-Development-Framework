import express from 'express';
import { createOrder, listOrders, getOrder, updateStatus } from '../controllers/orderController.js';
import { auth, admin } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, listOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateStatus);

export default router;
