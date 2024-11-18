// postRoutes.ts
import { Router } from 'express';
import { getFeed, getRelevantPosts } from '../controller/feed.controller';
import { Authorization } from '../middleware/auth.middleware';



const router = Router();

router.post("/",Authorization,getRelevantPosts);

export default router;