import mongoose from 'mongoose';
export const connectDB=(uri:string)=>{
    mongoose.connect(uri,{
        dbName:"social-media"
    }).then((connection)=>{
        console.log(`MongoDB Connected: ${connection.connection.name}`);
    }).catch((error)=>{
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    });
}