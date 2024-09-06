import express from "express"
import { loggout, login, signUp, userDetails } from "../contollers/userController.js";
import authToken from "../middlerware/authToken.js";

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", login);
userRouter.get('/user-details', authToken, userDetails);
userRouter.get('/sign-out', loggout )

export default userRouter;