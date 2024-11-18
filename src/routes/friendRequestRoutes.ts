import { Router } from 'express';
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriendRequests,
    searchFriends
} from '../controller/friend-request.controller';
import { Authorization } from '../middleware/auth.middleware';

const router = Router();
router.get('/',(req,res)=>{
    res.send('Friend Request Routes');
})

// Route to send a friend request
router.post('/send',Authorization, sendFriendRequest);

// Route to accept a friend request
router.put('/accept/:requestId',Authorization, acceptFriendRequest);

// Route to reject a friend request
router.put('/reject/:requestId',Authorization, rejectFriendRequest);

// Route to cancel a friend request
router.delete('/cancel/:requestId',Authorization, cancelFriendRequest);

// Route to get all friend requests for a user
router.get('/friend/:userId',Authorization, getFriendRequests);

// Route to search friends by username or email
router.get('/search',Authorization, searchFriends);

export default router;
