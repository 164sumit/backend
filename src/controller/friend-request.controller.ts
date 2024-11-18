import { Request, Response } from 'express';
import { FriendRequest } from '../models/friend-request.model';
import { User } from '../models/user.model';



// Search friends by username or email
export const searchFriends = async (req: Request, res: Response) => {
    try {
        // console.log("first")
        const { query } = req.query;
        
        // console.log("query",query);
        // res.status(200).json({
        //     message: 'Friends found successfully',
        //     // users
        // })
        

        if (!query) {
             res.status(400).json({ message: 'Query parameter is required' });
             return
        }

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        }).select('username email');

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Error searching friends', error });
    }
};


// Send a friend request
export const sendFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log("2md")
        const { senderId, receiverId ,userId} = req.body;
        const newFriendRequest = new FriendRequest({ sender: userId, receiver: receiverId, status: 'pending' });
        await newFriendRequest.save();
        res.status(201).json({ message: 'Friend request sent successfully', friendRequest: newFriendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error sending friend request', error });
    }
};

// Accept a friend request
export const acceptFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log("third")
        const { requestId } = req.params;
        const friendRequest = await FriendRequest.findOne({_id:requestId,
            $or:[
                {sender:req.body.userId},
                {receiver:req.body.userId}
            ]
         });
        if (!friendRequest) {
             res.status(404).json({ message: 'Friend request not found' });
             return
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, { $push: { friends: friendRequest.receiver } });
        await User.findByIdAndUpdate(friendRequest.receiver, { $push: { friends: friendRequest.sender } });

        res.status(200).json({ message: 'Friend request accepted', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting friend request', error });
    }
};

// Reject a friend request
export const rejectFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log("forth")
        const { requestId } = req.params;
        const friendRequest = await FriendRequest.findOne({_id:requestId,
            $or:[
                {sender:req.body.userId},
                {receiver:req.body.userId}
            ]
        });
        if (!friendRequest) {
             res.status(404).json({ message: 'Friend request not found' });
             return
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request rejected', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting friend request', error });
    }
};

// Cancel a friend request
export const cancelFriendRequest = async (req: Request, res: Response) => {
    try {
        console.log("fifth")
        const { requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
             res.status(404).json({ message: 'Friend request not found' });
             return
        }

        await FriendRequest.findOneAndDelete({_id:requestId,sender:req.body.userId});
        res.status(200).json({ message: 'Friend request cancelled', friendRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling friend request', error });
    }
};

// Get all friend requests for a user
export const getFriendRequests = async (req: Request, res: Response) => {
    try {
        console.log("sixth")
        const { userId } = req.body;
        const friendRequests = await FriendRequest.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate('sender receiver', 'username email');

        res.status(200).json({ friendRequests });
    } catch (error) {
        res.status(500).json({ message: 'Error getting friend requests', error });
    }
};
