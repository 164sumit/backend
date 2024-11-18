import { NextFunction,Request, Response } from "express"
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/user.model";
export interface IRequest extends Request {
    userId: string
}
export const Authorization=async(req:Request,res:Response,next:NextFunction)=>{
    // next();
    const token= req.header('Authorization');
    console.log(token);
    
    if(!token){
         res.status(401).json({message:"Unauthorized"})
         return
    }
    else{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string };
        // const user = await User.findById(decodedToken.userId);
        if(decodedToken.userId){
            req.body.userId= decodedToken.userId;
            next();
        }
        else{
             res.status(401).json({message:"Unauthorized"})
             return
        }

    }

}