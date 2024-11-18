// friend-request.schema.ts
import { Schema, model } from 'mongoose';
export interface IFriendRequest {
    _id: string;
    sender: string;
    receiver: string;
    status: string;
  }
const FriendRequestSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  status: String,
});

export  const FriendRequest= model<IFriendRequest>('FriendRequest', FriendRequestSchema);
