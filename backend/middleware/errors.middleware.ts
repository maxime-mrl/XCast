import { Response, Request, NextFunction } from "express";

export default (err:Error, _req:Request, res:Response, next:NextFunction) => { // https://reflectoring.io/express-error-handling/
    // send back an easily understandable error message to the caller
    const status = "status" in err && typeof err.status === "number" ? err.status : 500;
    res.status(status).json({
        status: status,
        error: err.message
    });
    console.error(err)
    next();
};
