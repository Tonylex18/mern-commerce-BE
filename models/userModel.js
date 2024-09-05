import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email : {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        require: true
    },
    confirmPassword: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
    }
}, {
    timestamps: true
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)
export default userModel;