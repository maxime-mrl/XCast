import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import db from "@config/db";
import router from "@routes";
import errorsMiddleware from "@middleware/errors.middleware";
import usersModel from "@models/users.model";

const corsOptions = {
  credentials: true,
  origin: "*",
};

const port = process.env.PORT;
const app = express();
const server = createServer(app);

// socket.io config
export const io = new Server(server, { cors: corsOptions });
io.on("connection", (socket) => {
  // add user socket id to db
  socket.on(
    "register",
    async (user) =>
      await usersModel.updateOne(
        { _id: user._id },
        { $addToSet: { socketIds: socket.id } }
      )
  );
  // remove user socket id from db when disconnected
  socket.on(
    "disconnect",
    async () =>
      await usersModel.updateOne(
        { socketIds: socket.id },
        { $pull: { socketIds: socket.id } }
      )
  );
});

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use("/", router);
// handle errors
app.use(errorsMiddleware);

// start the server
db.connect()
  .then((result) => {
    console.log(result);
    server
      .listen(port, () => console.log(`listening on port ${port}`))
      .on("error", (err) => {
        if ("code" in err && err.code === "EADDRINUSE")
          console.log("Port busy");
        else console.log(err);
      });
  })
  .catch((err) => console.error(err));
