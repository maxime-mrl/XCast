// types
import { Request, Response } from "express";
import { Types } from "mongoose";
import { requestWithUser } from "@customTypes";
// imports
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { io } from "@/";
import usersModel from "@models/users.model";
import {
  checkUser,
  checkAndParseSettings,
} from "@middleware/modelsMiddleware/userCheck.middleware";

/* -------------------------------------------------------------------------- */
/*                             CREATE NEW ACCOUNT                             */
/* -------------------------------------------------------------------------- */
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, settings: rawSettings } = req.body;
    // check everything is here and valid
    if (!username || !mail || !password || !rawSettings)
      throw {
        message: "Il manque au moins un champ",
        status: 400,
      };
    const userInput = await checkUser({ mail, username, password });
    // check settings validity
    const settings = checkAndParseSettings(rawSettings);
    /* ------------------------------- CREATE USER ------------------------------ */
    const user = await usersModel.create({ ...userInput, settings });
    /* -------------------------------- RESPONSE -------------------------------- */
    if (user)
      res.status(201).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    else throw new Error("Le compte n'a pas pu être créé, merci de réessayer.");
  }
);

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  /* ------------------------------ INPUTS CHECK ------------------------------ */
  const { mail, password } = req.body;
  // check everything is here
  if (!mail || !password)
    throw {
      message: "Il manque au moins un champ",
      status: 400,
    };
  /* --------------------------- MAIL AND PASS CHECK -------------------------- */
  const user = await usersModel.findOne({ mail });
  if (user && (await bcrypt.compare(password, user.password)))
    res.status(200).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  else
    throw {
      message: "Identifiants incorrects",
      status: 200,
    };
});

/* -------------------------------------------------------------------------- */
/*                             GET USER SETTINGS                              */
/* -------------------------------------------------------------------------- */
export const getUserSettings = asyncHandler(
  async (req: requestWithUser, res: Response) => {
    /* -------------------------- RETURN USER SETTINGS -------------------------- */
    const units = req.user?.settings?.units
      ? Object.fromEntries(req.user.settings.units.entries())
      : {};
    res.status(200).json({ ...req.user?.settings, units });
  }
);

/* -------------------------------------------------------------------------- */
/*                             UPDATE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
// whole user update
export const updateUser = asyncHandler(
  async (req: requestWithUser, res: Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { username, mail, password, confirmPassword } = req.body;
    const user = await usersModel.findOne({ _id: req.user?._id });

    // necessary datas are presents
    if (!confirmPassword || !user)
      throw {
        message: "At least one missing field",
        status: 400,
      };
    // password check
    if (!(await bcrypt.compare(confirmPassword, user.password)))
      throw {
        message: "Incorrect credentials",
        status: 400,
      };
    // check datas validity
    await checkUser({ mail, username, password });
    /* ------------------------------- UPDATE DATA ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(
      user._id,
      {
        mail,
        username,
        password,
      },
      { new: true }
    );
    if (!updatedUser)
      throw new Error("Oups, ça n'a pas marché, merci de réessayer.");
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      token: generateToken(updatedUser._id),
    });
  }
);

// settings update
export const updateUserSettings = asyncHandler(
  async (req: requestWithUser, res: Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const rawSettings = req.body;
    if (!rawSettings) {
      res.status(200).json({ status: 400 });
      return;
    }
    // check settings validity
    const settings = checkAndParseSettings(rawSettings);
    /* ------------------------------- UPDATE DATA ------------------------------ */
    const updatedUser = await usersModel.findByIdAndUpdate(req.user?._id, {
      settings: { ...req.user?.settings, ...settings },
    });
    if (!updatedUser)
      throw new Error(
        "Erreur serveur, vos données n'ont pas été synchronisées."
      );
    res.status(200).json({ status: 200 });
    /* -------------------------- EMIT SOCKET.IO EVENTS ------------------------- */
    // check if we have some socketIds
    if (updatedUser.socketIds.length === 0) return;
    updatedUser.socketIds.forEach(async (socketId) => {
      // check socketId is valid and if not remove it from user
      if (!io.sockets.sockets.has(socketId))
        await usersModel.updateOne(
          { _id: updatedUser._id },
          { $pull: { socketIds: socketId } }
        );
      // if valid, send updated settings to user
      else io.to(socketId).emit("sync", rawSettings);
    });
  }
);

/* -------------------------------------------------------------------------- */
/*                             DELETE USER ACCOUNT                            */
/* -------------------------------------------------------------------------- */
export const deleteUser = asyncHandler(
  async (req: requestWithUser, res: Response) => {
    /* ------------------------------ INPUTS CHECK ------------------------------ */
    const { confirmPassword } = req.body;
    const user = await usersModel.findOne({ _id: req.user?._id });
    // necessary datas are presents
    if (!confirmPassword || !user)
      throw {
        message: "At least one missing field",
        status: 400,
      };
    // password check
    if (!(await bcrypt.compare(confirmPassword, user.password)))
      throw {
        message: "Incorrect credentials",
        status: 400,
      };
    /* ------------------------ DELETE SELF USER ACCOUNT ------------------------ */
    const query = await usersModel.deleteOne({ _id: user._id });
    if (!query.acknowledged) throw new Error(query as any);
    res.status(200).json({ deleted: req.user?.mail });
  }
);

// generate token
const generateToken = (id: Types.ObjectId) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "", { expiresIn: "30d" });
