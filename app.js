const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

app.use("/api", authRoutes);
app.get("/test", (req, res) => {
  res.send("Server is alive");
});

module.exports = app;