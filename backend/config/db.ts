import mongoose from "mongoose";

// try to connect database
const connect = async () => {
  // check for db url
  if (typeof process.env.MONGO_URI !== "string")
    throw new Error("No mongoDB URI provided!");
  // connect to database
  const conn = await mongoose.connect(process.env.MONGO_URI);
  return `Connected to mongoDB: ${conn.connection.host}`;
};

export default {
  connect,
};
