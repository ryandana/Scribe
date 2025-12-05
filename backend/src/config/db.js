import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
        });
        console.log(`Connected to database ${mongoose.connection.name}`);
    } catch (error) {
        console.error(error);
    }
};

export default dbConnect;
