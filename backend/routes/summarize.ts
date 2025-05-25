import { Router, type RequestHandler } from 'express';
import { summarizeTodos } from '../controllers/summarizeController';

const router = Router();
router.post('/', summarizeTodos as RequestHandler);
export default router;