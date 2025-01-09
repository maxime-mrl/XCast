import { NextFunction } from 'express';
import { customError, requestWithUser } from '@customTypes';
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import userModel from "../models/users.model";

const tokenError:customError = new Error("Invalid token");
tokenError.status = 401;

export const protect = asyncHandler(async (req: requestWithUser, _, next: NextFunction) => {
    /* -------------------------------- GET TOKEN ------------------------------- */
    let token: string | undefined;
    if (req.headers.authorization?.startsWith("Bearer")) token = req.headers.authorization.split(" ")[1];
    if (!token) throw tokenError;
    /* -------------------------------- CHECK IT -------------------------------- */
    try {
        // check token validity and that id is indeed a real user
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if (typeof decoded === "string") throw tokenError;
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) throw tokenError;
        // add user to request
        req.user = user.toObject() as requestWithUser["user"];
        next();
    } catch(err: any) {
        // if error try to parse it to the token Error
        if (err.messsage && /token|expired/.test(err.message)) err = tokenError
        // throw it for error handler
        throw err;
    }
});
