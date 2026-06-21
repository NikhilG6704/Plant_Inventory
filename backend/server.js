const express = require("express");
const cors = require("cors");
const fs = require("fs");
const assetRoutes = require("./routes/assets");
const db = require("./database/db");
const issueRoutes = require("./routes/issues");
const damagedRoutes = require("./routes/damaged");
const app = express();

app.use(cors());
app.use(express.json());

const schema = fs.readFileSync("./database/schema.sql", "utf8");

db.exec(schema);

app.get("/", (req, res) => {
  res.json({
    message: "Inventory API Running",
  });
});

app.use("/api/assets", assetRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/damaged", damagedRoutes);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
