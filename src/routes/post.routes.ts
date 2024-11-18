// postRoutes.ts
import { Router } from 'express';
import { createComment, createPost, getSinglePost } from '../controller/post.controller';
import { Authorization } from '../middleware/auth.middleware';


const router = Router();

// Route to create a new post

router.post('/',Authorization, createPost); 
router.get('/:postId',Authorization, getSinglePost); 


// Route to create a comment on a post
router.post('/:postId/comments', Authorization,createComment);


export default router;