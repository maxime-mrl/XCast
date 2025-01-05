import mongoose, { Document } from "mongoose";
import userCheck from "../middleware/modelsMiddleware/userCheck.middleware";
import errorsHandler from "../middleware/modelsMiddleware/errorsHandler.middleware";

const userSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

// check to make sure user format are good
// userSchema.pre(/update|save/i, userCheck); // for now broken so to test just no check till I find a solution
// customize error thrown by mongoose
userSchema.post(/update|save/i, errorsHandler);

export interface User extends Document {
    mail: string,
    username: string,
    password: string
}

export default mongoose.model("Users", userSchema);
