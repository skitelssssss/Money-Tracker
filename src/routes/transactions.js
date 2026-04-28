import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/', transactionController.create);
router.get('/', transactionController.list);
router.delete('/:id', transactionController.remove);

export default router;
