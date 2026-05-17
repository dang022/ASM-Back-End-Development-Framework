import express from 'express';
import { createReview, listReviews } from '../controllers/reviewController.js';
import { auth } from '../middlewares/auth.js';
const router = express.Router({ mergeParams: true });

router.post('/', auth, createReview);
router.get('/', listReviews);

export default router;
