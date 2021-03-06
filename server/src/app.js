const path = require("node:path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiV1Router = require("./routes/api.v1");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(morgan("combined"));

app.use("/v1", apiV1Router);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
