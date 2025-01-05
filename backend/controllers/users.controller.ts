import { Request, Response } from "@node_modules/@types/express";
import { Types } from "mongoose";

import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import usersModel from "../models/users.model";
import { requestWithUser } from "@customTypes";

/* -------------------------------------------------------------------------- */
/*                             CREATE NEW ACCOUNT                             */
/* -------------------------------------------------------------------------- */
export const registerUser = asyncHandler(async (req:Request, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, age } = req.body;
    // check everything is here
    if (!username || !mail || !password) throw {
        message: "At least one missing field",
        status: 400
    };
    /* ------------------------------- CREATE USER ------------------------------ */
    const user = await usersModel.create({ mail, username, password });
    /* -------------------------------- RESPONSE -------------------------------- */
    if (user) res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
    });
    else throw new Error("User can't be created right now");
});

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
export const loginUser = asyncHandler(async (req:Request, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { mail, password } = req.body;
    // check everything is here
    if (!mail || !password) throw {
        message: "At least one missing field",
        status: 400
    };
    /* --------------------------- MAIL AND PASS CHECK -------------------------- */
    const user = await usersModel.findOne({ mail });
    if (user && await bcrypt.compare(password, user.password)) res.status(200).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
    });
    else throw {
        message: "Incorrect credentials",
        status: 200
    };
});

/* -------------------------------------------------------------------------- */
/*                               GET USER INFOS                               */
/* -------------------------------------------------------------------------- */
export const getUser = asyncHandler(async (req:requestWithUser, res:Response) => {
    /* ---------------------------- RETURN USER INFOS --------------------------- */
    res.status(200).json({
        _id: req.user._id,
        mail: req.user.mail,
        username: req.user.username,
        right: req.user.right
    });
});

/* -------------------------------------------------------------------------- */
/*                             UPDATE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
export const updateUser = asyncHandler(async (req:requestWithUser, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne(req.user);
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "At least one missing field",
        status: 400
    };
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) throw {
        message: "Incorrect credentials",
        status: 400
    };
    /* ------------------------------- UPDATE DATA ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(user._id, {
        mail,
        username,
        password,
    }, { new: true });
    if (!updatedUser) throw new Error("Oups, ça n'a pas marché, merci de réessayer.")
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        token: generateToken(updatedUser._id),
    });
});

/* -------------------------------------------------------------------------- */
/*                             DELETE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
export const deleteUser = asyncHandler(async (req:requestWithUser, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { confirmPassword } = req.body;
    const user = await usersModel.findOne({_id: req.user._id});
    // necessary datas are presents
    if (!confirmPassword || !user) throw {
        message: "At least one missing field",
        status: 400
    };
    // password check
    if (!await bcrypt.compare(confirmPassword, user.password)) throw {
        message: "Incorrect credentials",
        status: 400
    };
    /* ------------------------ DELETE SELF USER ACCOUNT ------------------------ */
    const query = await usersModel.deleteOne({_id: user._id });
    if (!query.acknowledged) throw new Error(query as any);
    res.status(200).json({ deleted: req.user.mail });
});

// generate token
const generateToken = (id:Types.ObjectId) => jwt.sign({id}, process.env.JWT_SECRET || "", { expiresIn: "30d" });
