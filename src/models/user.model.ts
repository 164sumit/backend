// user.model.ts
import { Model, model, Schema } from 'mongoose';



export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  friends: string[];
}
const UserSchema = new Schema({
    username: {
      type:String,
      require:true,
      
    },
    email:  {
      type:String,
      require:true,
      unique:true,
    },
    password:  {
      type:String,
      require:true,
      unique:true,
      Select:false,
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  });

export const User = model<IUser>('User', UserSchema);
