// feed.controller.ts
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { FriendRequest } from '../models/friend-request.model';
export const getRelevantPosts = async (req: Request, res: Response) => {
  try {
      const userId = req.body.userId;

      // Get user's friends
      const user = await User.findById(userId);
      if (!user) {
           res.status(404).json({ message: 'User not found' });
           return
      }
      const friends=await FriendRequest.find({ status:"accepted"  ,
        $or:[
            {sender:userId},
            {receiver:userId},

        ]
      })
      const list2:Array<string>=[];
      const friendsList=friends.filter((friend)=>{
          if(friend.sender.toString()==userId){
            list2.push(friend.receiver)
              return friend.receiver
          } else {
            list2.push(friend.sender)
              return friend.sender
          }
      })
      console.log("friends",list2);

      // Find posts that either:
      // 1. Were created by user's friends
      // 2. Have comments by user's friends
      const relevantPosts = await Post.find({
          $or: [
              { author: { $in: list2 } },           // Posts by friends
              { 'comments.author': { $in: list2 } } // Posts with comments by friends
          ]
      })
      .populate('author', 'username')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });

      res.json(relevantPosts);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
  }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("getfeed called");
    
    const userId = req.body.userId;
    console.log(userId);
    
    const user = await User.findById(userId).populate('friends');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const friendPosts = await Post.find();
    // const commentedPosts = await Post.find({
    //   'comments.author': { $in: user.friends },
    // });

    const feed = [...friendPosts, ];
    res.status(200).json(feed);
  } catch (error) {
    next(error);
  }
};
