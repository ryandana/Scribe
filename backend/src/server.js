import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();
dbConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth', authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`)
})

