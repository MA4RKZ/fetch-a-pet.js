const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const petRoutes = require("./routes/petRoutes");

const app = express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.static("public"));

app.use("/users", userRoutes);
app.use("/pets", petRoutes);

app.listen(5000);
