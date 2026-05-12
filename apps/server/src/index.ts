import express, {
  type Request,
  type Response,
  type Application,
} from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app: Application = express();
const server = createServer(app);
const PORT = 3000;
const io = new Server(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript Express!");
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
