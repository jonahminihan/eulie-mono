import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  createPiSession,
  getPiExtensionUIData,
  getPiSessions,
  loadPiSession,
  promptSession,
} from "./wrappers/pi.ts";

const app: Application = express();
const server = createServer(app);
const PORT = 3030;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("pi:createSession", async (data, callback) => {
    console.log("pi:createSession", data, callback);
    const { cwd } = data;
    const session = await createPiSession(socket, { cwd });
    console.log("pi:createSession session", session);
    callback(session);
  });

  socket.on("pi:getSessions", async (callback) => {
    console.log("pi:getSessions", callback);
    const sessions = await getPiSessions();
    callback(sessions);
  });

  socket.on("pi:loadSession", async (data, callback) => {
    console.log("pi:loadSession", socket);
    const { sessionId } = data;
    const session = await loadPiSession(socket, sessionId);
    callback(session);
  });

  socket.on("pi:promptSession", async (data, callback) => {
    console.log("pi:promptSession", data, callback);
    const { sessionId, message, options } = data;
    const result = await promptSession(sessionId, message, options);
    callback?.(result);
  });

  socket.on("pi:loadExtensionData", async (callback) => {
    console.log("a user connected");

    const extensionData = await getPiExtensionUIData();
    callback(extensionData);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
