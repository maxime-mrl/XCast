import { Request } from "@node_modules/@types/express";

declare interface customError extends Error {
    status?: number
};

declare interface requestWithUser extends Request {
    user?: any; // Replace 'any' with your user model type if available
};