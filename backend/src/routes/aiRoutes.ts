import { Router } from 'express';
import { getRecommendations, aiSearch } from '../controllers/aiController';

const router = Router();

// No auth required — guest users can also get recommendations
router.post('/recommendations', getRecommendations);
router.post('/search', aiSearch);

export default router;
