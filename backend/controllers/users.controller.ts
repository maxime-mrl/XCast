// types
import { Request, Response } from "express";
import { Types } from "mongoose";
import { requestWithUser } from "@customTypes";
// imports
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import usersModel, { User } from "@models/users.model";
import { checkUser, checkandParseSettings } from "@middleware/modelsMiddleware/userCheck.middleware";

    // const userDefaultPreferences = {
    //     forecastSettings: {
    //         model: "gfs",
    //         selected: "all",
    //         level: 2000,
    //         maxHeight: 500,
    //         position: false
    //     },
    //     units: new Map([
    //         ["temperature", { selected: "celsius" }],
    //         ["wind", { selected: "kmh" }],
    //         ["pressure", { selected: "hpa" }]
    //     ])
    // };

/* -------------------------------------------------------------------------- */
/*                             CREATE NEW ACCOUNT                             */
/* -------------------------------------------------------------------------- */
export const registerUser = asyncHandler(async (req:Request, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, settings:rawSettings } = req.body;
    // check everything is here and valid
    if (!username || !mail || !password || !rawSettings) throw {
        message: "Il manque au moins un champ",
        status: 400
    };
    await checkUser({ mail, username, password });
    // transform received units object to Map
    // if (settings.units) settings.units = new Map(Object.entries(settings.units));
    // check settings validity
    const settings = checkandParseSettings(rawSettings);
    /* ------------------------------- CREATE USER ------------------------------ */
    const user = await usersModel.create({ mail, username, password, settings });
    /* -------------------------------- RESPONSE -------------------------------- */
    if (user) res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
    });
    else throw new Error("Le compte n'a pas pu être créé, merci de réessayer.");
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
        _id: req.user?._id,
        mail: req.user?.mail,
        username: req.user?.username,
    });
});

/* -------------------------------------------------------------------------- */
/*                             UPDATE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
export const updateUser = asyncHandler(async (req:requestWithUser, res:Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne({ _id: req.user?._id });

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
    // check datas validity
    await checkUser({ mail, username, password });
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
    const user = await usersModel.findOne({_id: req.user?._id});
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
    res.status(200).json({ deleted: req.user?.mail });
});

// generate token
const generateToken = (id:Types.ObjectId) => jwt.sign({id}, process.env.JWT_SECRET || "", { expiresIn: "30d" });
