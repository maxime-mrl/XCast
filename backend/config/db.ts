import mongoose from "mongoose";

const connect = async () => {
  // try to connect database
  if (typeof process.env.MONGO_URI !== "string")
    throw new Error("No mongoDB URI provided!");
  const conn = await mongoose.connect(process.env.MONGO_URI);
  return `Connected to mongoDB: ${conn.connection.host}`;
};

export default {
  connect,
};
