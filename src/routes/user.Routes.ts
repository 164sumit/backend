import { Router } from 'express';
import { Login, registerUser, sendFriendRequest, acceptFriendRequest, UserInfo } from '../controller/user.controller';

const router = Router();
router.post('/me',UserInfo);
// Register a new user
router.post('/register', registerUser);

// User login
router.post('/login', Login);

// Send friend request
router.post('/friend-request', sendFriendRequest);

// Accept friend request
router.put('/friend-request/:id/accept', acceptFriendRequest);

export default router;