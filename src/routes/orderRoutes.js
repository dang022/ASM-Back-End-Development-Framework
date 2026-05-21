import express from 'express';
import { createOrder, listOrders, getOrder, updateStatus } from '../controllers/orderController.js';
import { auth, admin } from '../middlewares/auth.js';
const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, totalAmount]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *               totalAmount:
 *                 type: number
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 *       401:
 *         description: Unauthorized
 *   get:
 *     tags: [Orders]
 *     summary: Get user's orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, createOrder);
router.get('/', auth, listOrders);

/**
 * @openapi
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 */
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateStatus);

export default router;
