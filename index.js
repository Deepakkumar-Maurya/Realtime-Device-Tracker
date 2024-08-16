import express from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { fileURLToPath } from "url";

// ** Create Express App
const app = express();
const PORT = 3000;

// ** Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ** Create HTTP and Socket Server
const server = http.createServer(app);
const io = new Server(server);

// ** Set View Engine
app.set("view engine", "ejs");
// ** Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// ** Socket Connection
io.on("connection", (socket) => {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnect", { id: socket.id });
    });
});

// ** Routes
app.get("/", (req, res) => {
    res.render("index");
});

// ** Start Server
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
