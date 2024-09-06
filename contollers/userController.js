import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if all fields are provided
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email"
            });
        }
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please provide a password"
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        // console.log("isPasswordMatch: ", isPasswordMatch);

        if (isPasswordMatch) {
            const token = {
                _id: user._id,
                email: user.email,
            }
            const accessToken = await jwt.sign(token, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 80 });

            const tokenOption = {
                httpOnly: true,
                secure: true
            }

            res.status(200).cookie("accessToken", accessToken, tokenOption).json({
                success: true,
                data: accessToken,
                message: "Login successful"
            })

        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }

}


// Register a user
const signUp = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Check if the user already exists
        const exists = await userModel.findOne({ email });

        // Check if all fields are provided
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Please provide a name"
            });
        }
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide an email"
            });
        }
        if (!password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Please provide both password and confirm password"
            });
        }

        // Ensure the passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        if (exists) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate password strength (at least 8 characters)
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hashing the passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedConfirmPassword = await bcrypt.hash(confirmPassword, salt);

        const payload = {
            ...req.body,
            role: "GENERAL",
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword  
        };

        // Create new user
        const newUser = new userModel(payload);

        // Save user in DB
        const savedUser = await newUser.save();

        // Exclude sensitive information like the password and confirmPassword from the response
        const userResponse = {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
        };

        // Respond with success and the user data
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
};


// user details
const userDetails = async (req, res) => {
    try {
        // Access the user object from the req.user set by the authToken middleware
        const userId = req.user.id;

        // fetch the user details from the database
        const user = await userModel.findById(userId); 

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || error,
            data: [],
        });
    }
};

// Logout user
const loggout = async (req, res) => {
    try {
        res.clearCookie("accessToken")

        const userResponse = {
            id: "",
            name: "",
            email: "",
            role: "",
        };

        // Respond with success and the user data
        return res.status(201).json({
            success: true,
            message: "Logged out successfully!",
            data: userResponse
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging out"
        });
    }
}

export { signUp, login, userDetails, loggout };
