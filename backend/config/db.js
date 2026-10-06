import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connected");
        
    } catch (error) {
        console.log("MongoDB connection Failed:", error.message);    
    }
}

export default connectDB;