// post.controller.ts
import { Request, Response, NextFunction } from 'express';
import { IComment, Post } from '../models/post.model';
import { IRequest } from '../middleware/auth.middleware';
import { IUser, User } from '../models/user.model';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { FriendRequest } from '../models/friend-request.model';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = new Post({...req.body,author:req.body.userId});
    await post.save();
    res.status(201).json({post,success: true});
  } catch (error) {
    res.status(500).json({success:false,error})
    return;
    next(error);
  }
};

// export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
//   } catch (error) {
//     next(error);
//   }
// };


// Define proper interfaces that match your MongoDB schema
interface PopulatedAuthor {
  _id: mongoose.Types.ObjectId | string;
  username: string;
}

interface PopulatedComment {
  _id?: mongoose.Types.ObjectId | string;
  text: string;
  author: PopulatedAuthor;
}

interface PopulatedPost {
  _id: mongoose.Types.ObjectId | string;
  text: string;
  author: PopulatedAuthor;
  comments: PopulatedComment[];
  __v: number;
}

export const getSinglePost = async (req: Request, res: Response) => {
  try {
      const { postId } = req.params;
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
      const objectId:any = new mongoose.Types.ObjectId(userId);
      list2.push(objectId);
      console.log("friends",list2);
      const post=await Post.findOne({_id:postId,
        $or: [
          { author: { $in: list2 } },           // Posts by friends
          { 'comments.author': { $in: list2 } } // Posts with comments by friends
      ]
      }).populate<{ author: PopulatedAuthor }>('author', 'username')
          .populate<{ comments: PopulatedComment[] }>({
              path: 'comments.author',
              select: 'username'
          });

      // Find the post and populate author fields
      // const post = await Post.findById(postId)
      //     .populate<{ author: PopulatedAuthor }>('author', 'username')
      //     .populate<{ comments: PopulatedComment[] }>({
      //         path: 'comments.author',
      //         select: 'username'
      //     });

      if (!post) {
           res.status(404).json({ message: 'Post not found' });
           return
      }

      // Convert mongoose document to plain object
      const postObject = post.toObject() as PopulatedPost;

      // Check if user has access to this post
      const hasAccess = user.friends.some(friendId => 
          friendId.toString() === postObject.author._id.toString()
      );

      // if (!hasAccess) {
      //      res.status(403).json({ 
      //         message: 'You can only view posts from your friends' 
      //     });
      //     return
      // }

      // Add additional information
      const enrichedPost = {
          ...postObject,
          
          friendComments: postObject.comments.filter(comment =>
              user.friends.some(
                  friendId => friendId.toString() === (comment.author._id?.toString() || '')
              )
          ),
      };

      res.json(enrichedPost);

  } catch (error) {
      console.error('Error in getSinglePost:', error);
      res.status(500).json({ 
          message: 'Error fetching post', 
          error: error instanceof Error ? error.message : 'Unknown error' 
      });
  }
};
// export const getSinglePost = async (req: Request, res: Response) => {
//   try {
//       const { postId } = req.params;
//       const userId = req.body.userId;

//       // Get user's friends
//       const user = await User.findById(userId);
//       if (!user) {
//            res.status(404).json({ message: 'User not found' });
//            return
//       }

//       // Find the post and populate author fields
//       const post = await Post.findById(postId)
//           .populate<{ author: PopulatedAuthor }>('author', 'username')
//           .populate<{ comments: PopulatedComment[] }>({
//               path: 'comments.author',
//               select: 'username'
//           });

//       if (!post) {
//            res.status(404).json({ message: 'Post not found' });
//            return
//       }

//       // Convert mongoose document to plain object
//       const postObject = post.toObject() as PopulatedPost;

//       // Check if user has access to this post
//       const hasAccess = user.friends.some(friendId => 
//           friendId.toString() === postObject.author._id.toString()
//       );

//       if (!hasAccess) {
//            res.status(403).json({ 
//               message: 'You can only view posts from your friends' 
//           });
//           return
//       }

//       // Add additional information
//       const enrichedPost = {
//           ...postObject,
//           isAuthorFriend: user.friends.some(
//               friendId => friendId.toString() === postObject.author._id.toString()
//           ),
//           friendComments: postObject.comments.filter(comment =>
//               user.friends.some(
//                   friendId => friendId.toString() === (comment.author._id?.toString() || '')
//               )
//           ),
//       };

//       res.json(enrichedPost);

//   } catch (error) {
//       console.error('Error in getSinglePost:', error);
//       res.status(500).json({ 
//           message: 'Error fetching post', 
//           error: error instanceof Error ? error.message : 'Unknown error' 
//       });
//   }
// };



export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
       res.status(404).json({ message: 'Post not found' });
       return
    }
    const user=await User.findById(req.params.userId);
    const comment:IComment  = { text: req.body.text, author: req.body.userId };
    post.comments.push(comment);
    await post.save();
    // comment[User]=user;
    res.status(201).json(comment);
  } catch (error) {

    next(error);
  }
};


