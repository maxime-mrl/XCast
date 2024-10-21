import("dotenv").then(dotenv => dotenv.config())
import express from "express";
import cors from "cors";
import db from "./config/db.js";
import router from "./routes/index.js";

const port = process.env.PORT;
const app = express();

// express config
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use("/", router);

// start the server
db.connect()
    .then(result => {
        console.log(result);
        app.listen(port, () => console.log(`listening on port ${port}`))
        .on("error", err => {
            if ("code" in err && err.code === 'EADDRINUSE') console.log('Port busy');
            else console.log(err);
        });
    })
    .catch(err => console.error(err));
