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
// each connection will be added to the db in an array of socket ids
// when an update is needed, the server will send the update to all the socket ids in the array
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
  .then((result) => { // try to connect database
    console.log(result); // OK
    server
      .listen(port, () => console.log(`listening on port ${port}`)) // listen on port
      .on("error", (err) => { // listenning error
        if ("code" in err && err.code === "EADDRINUSE")
          console.log("Port busy");
        else console.log(err);
      });
  })
  .catch((err) => console.error(err)); // db connection error
