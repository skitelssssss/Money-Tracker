import { Router } from 'express';
import { healthcheck } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthcheck);

export default router;
