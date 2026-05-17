import express from 'express';
import { list, getById, create, update, remove } from '../controllers/productController.js';
import { auth, admin } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', list);
router.get('/:id', getById);
router.post('/', auth, admin, create);
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, remove);

export default router;
