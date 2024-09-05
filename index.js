import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"



//  add config
const app = express()
const PORT = 8080 || process.env.PORT

// middleware
app.use(express.json())

// cookie-parser
app.use(cookieParser())

//access frontend from backend
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter)

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
})

// mongodb+srv://Tonylex18:An41285600@cluster0.8bohf.mongodb.net/?