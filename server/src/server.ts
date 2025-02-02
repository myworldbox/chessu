var dotenv = require("dotenv");
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import express from "express";
import { createServer } from "http";
import session from "./middleware/session";
import { Server } from "socket.io";
import { init as initSocket } from "./socket/index";
import { db, INIT_TABLES } from "./db/index";
import routes from "./routes/index";

dotenv.config()

const corsConfig = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
};

const app = express();
const server = createServer(app);

// database
(async () => {
    await db.connect();
    db.query(INIT_TABLES, (err:any) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Tables initialized");
        }
    });
})()

// middleware
app.use(cors(corsConfig));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session);
app.use("/v1", routes);

// socket.io
export const io = new Server(server, { cors: corsConfig, pingInterval: 30000, pingTimeout: 50000 });
io.use((socket:any, next:any) => {
    session(socket.request as Request, {} as Response, next as NextFunction);
});
io.use((socket:any, next:any) => {
    const session = socket.request.session;
    if (session && session.user) {
        next();
    } else {
        console.log("io.use: no session");
        socket.disconnect();
    }
});
initSocket();

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`chessu api server listening on :${port}`);
});
