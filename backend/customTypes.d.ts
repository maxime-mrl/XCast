import { User } from "@models/users.model";
import { Request } from "@node_modules/@types/express";

declare interface customError extends Error {
    status?: number
};

declare interface requestWithUser extends Request {
    user?: Partial<User>; // Replace 'any' with your user model type if available
};