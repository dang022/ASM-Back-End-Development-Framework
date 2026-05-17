import express from 'express';
import { list, create, update, remove } from '../controllers/categoryController.js';
import { auth, admin } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', list);
router.post('/', auth, admin, create);
router.put('/:id', auth, admin, update);
router.delete('/:id', auth, admin, remove);

export default router;
