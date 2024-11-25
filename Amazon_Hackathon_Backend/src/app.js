import express from 'express';
import cors from 'cors' // if the whiteListing is required from backend to deliver the data to forntend
import cookieParser from "cookie-parser"

const app = express();


// middlewares
app.use(express.json());       // accepting this size of amount of json data here
app.use(express.urlencoded({
    extended:true,
    limit: "16kb"
}));
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})) // if cors is requested for backend to deliver the data


// routes imports
import userRouter from "./routes/user.routes.js"


// routes declaration
app.use("/api/v1/users", userRouter)


export default app;