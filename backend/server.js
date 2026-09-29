const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const shopRoutes = require("./routes/shopRoutes");
const discountRoutes = require("./routes/discountRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

connectDB();

const app = express();

/* =========================
   CREATE HTTP SERVER
========================= */

const server = http.createServer(app);

/* =========================
   SOCKET.IO
========================= */

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

/* =========================
   SOCKET CONNECTION
========================= */

io.on("connection", (socket) => {

    console.log("🔌 Admin/Client connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });

});

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/reviews", reviewRoutes);

/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.send("Khakhra E-Commerce API Running...");
});

/* =========================
   MAKE SOCKET.IO AVAILABLE
   TO OTHER FILES
========================= */

app.set("io", io);

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO running on port ${PORT}`);
});