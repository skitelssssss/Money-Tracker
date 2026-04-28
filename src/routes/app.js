import { Router } from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

router.get('/app', (_req, res) => {
  res.sendFile(join(__dirname, '..', '..', 'dist', 'index.html'));
});

export default router;
