// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const targetRoutes = require("./routes/targetRoutes");

// const app = express();

// /* ✅ CORS FIX */
// app.use(cors({
//   origin: "*",
//   methods: ["GET", "POST", "DELETE", "PUT"]
// }));

// app.use(express.json());

// /* ✅ MongoDB */
// mongoose.connect("mongodb+srv://root:root@cluster0.mmwdllw.mongodb.net/")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.log("❌ MongoDB not running:", err.message));


// /* ✅ serve uploads */
// app.use("/uploads", express.static("uploads"));

// /* ✅ routes */
// app.use("/api/targets", targetRoutes);

// app.use("/mind", express.static("public"));


// /* ✅ listen on ALL networks (important for mobile) */
// app.listen(5000, "0.0.0.0", () =>
//   console.log("✅ Server running on http://0.0.0.0:5000")
// );


require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const targetRoutes = require("./routes/targetRoutes");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"]
}));

app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* =========================
   STATIC FILES
========================= */

// Serve uploaded images/videos
app.use("/uploads", express.static("uploads"));

// Serve compiled MindAR file
app.use("/mind", express.static("public"));

/* =========================
   ROUTES
========================= */

app.use("/api/targets", targetRoutes);

/* =========================
   ROOT CHECK ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("🚀 AR Video Backend Running");
});

/* =========================
   ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
