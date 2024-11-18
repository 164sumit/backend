// app.ts
import express, { Application } from 'express';
// import { userController } from './controller/user.controller';
// import { postController } from './controller/post.controller';
// import { feedController } from './controller/feed.controller';
// import { authenticate } from './auth.middleware';
import userRoutes from './routes/user.Routes'
import postRoutes from './routes/post.routes'
import feedRoutes from './routes/feed.Routes'
import friendRequestRoutes from './routes/friendRequestRoutes'
const app: Application = express();
import dotenv from 'dotenv';
import { connectDB } from './utils/database';

import cors from 'cors';
app.use(cors());
dotenv.config();
connectDB(process.env.MONGODB_URI || '');
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(express.json());


app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/friendrequests', friendRequestRoutes);
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
app.listen(3001, () => {
  console.log('Server started on port 3001');
});
