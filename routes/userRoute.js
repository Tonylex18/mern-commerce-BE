import express from "express"
import { login, signUp } from "../contollers/userController.js";

const userRouter = express.Router();

userRouter.post("/signUp", signUp);
userRouter.post("/login", login);

export default userRouter;