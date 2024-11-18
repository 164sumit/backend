// user.controller.ts
import { Request, Response, NextFunction } from 'express';

import { FriendRequest } from '../models/friend-request.model';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const  UserInfo=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
  try {
    const token=req.body.token;
    console.log(token);
    
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string };
    const user = await User.findById(decodedToken.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Error fetching user info' })
    next(error);
  }
}
export const Login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findOne({ email: req.body.email },{password:1,email:1,username:1})
      console.log(user);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      const isValidPassword = await bcrypt.compare(req.body.password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: 'Invalid password' });
        return;
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
        expiresIn: '1h',
      });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure flag should be true in production
        sameSite: 'strict',
      });
      user.password ="sd"
      res.status(200).json({ message: 'Logged in successfully' ,token: token,user});
    } catch (error) {
      res.status(500).json({ message:'Error logging in  '})
      next(error);
    }
  };
  

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hashedpassword=await bcrypt.hash(req.body.password,10);
    const user = new User({...req.body,password:hashedpassword});
    await user.save();
     res.status(201).json(user);
     return
  } catch (error:any) {
    console.log(error.errmsg);
    
     res.status(500).json({message:error.errmsg})
     return
  }
};

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const friendRequest = new FriendRequest(req.body);
    await friendRequest.save();
    res.status(201).json(friendRequest);
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const friendRequest = await FriendRequest.findById(req.params.id);
    if (!friendRequest) {
      res.status(404).json({ message: 'Friend request not found' });
      return;
    }
    friendRequest.status = 'accepted';
    await friendRequest.save();
    res.status(200).json({ message: 'Friend request accepted', friendRequest });
  } catch (error) {
    next(error);
  }
};
