const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const users = require("./routes/user");
const auth = require("./routes/auth");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/category");
const app = express();
app.use(express.json());
app.use(cors());
if (!config.get("jwtprivatekey")) {
  console.log("FATAL ERROR: No private key for JWT found!");
  process.exit(1);
}
mongoose
  .connect("mongodb://localhost:27017/adminPannel", {
    family: 4,
  })
  .then(() => console.log("Connected to the MongoDB"))
  .catch((err) => console.error("Not Connected", err));

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App is listening on port ${port}`));
