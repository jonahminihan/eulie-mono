import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  createPiSession,
  getPiSessions,
  loadPiSession,
  promptSession,
} from "./wrappers/pi.ts";
import path from "path";
import cors from "cors";
import { getExtensions } from "./stores/piStore.ts";
import { listDirectory } from "./services/fileSystemService.ts";

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

// Enable CORS for all requests
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("pi:createSession", async (data, callback) => {
    const { cwd } = data;
    const session = await createPiSession(socket, { cwd });
    callback(session);
  });

  socket.on("pi:getSessions", async (callback) => {
    const sessions = await getPiSessions();
    callback(sessions);
  });

  socket.on("pi:loadSession", async (data, callback) => {
    const { sessionId } = data;
    const session = await loadPiSession(socket, sessionId);
    callback(session);
  });

  socket.on("pi:promptSession", async (data, callback) => {
    const { sessionId, message, options } = data;
    const result = await promptSession(sessionId, message, options);
    callback?.(result);
  });

  socket.on("pi:getExtensionsPaths", async (callback) => {
    const extensionPaths = getExtensions();
    callback(extensionPaths);
  });

  socket.on("fs:listDirectory", async (data, callback) => {
    try {
      const result = await listDirectory(data?.path || "/");
      callback(result);
    } catch (error) {
      callback({
        error: error instanceof Error ? error.message : "Unknown filesystem error",
        path: data?.path,
      });
    }
  });
});

app.get("/extension/*path", (req: Request, res: Response) => {
  const extensionPath = (req.params.path as string[]).join("/");
  res.sendFile("index.js", {
    root: path.join("/", extensionPath, "dist"),
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
