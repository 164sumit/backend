// post.schema.ts
import { Schema, model } from 'mongoose';
export interface IPost {
    _id: string;
    text: string;
    author: string;
    comments: IComment[];
  }
  
  export interface IComment {
    _id?: string;
    text: string;
    author: string;
  }
const PostSchema = new Schema({
  text: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [
    {
      text: String,
      author: { type: Schema.Types.ObjectId, ref: 'User' },
    },
  ],
});

export const Post= model<IPost>('Post', PostSchema);
