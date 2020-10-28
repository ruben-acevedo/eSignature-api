require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT;
const router = require("./src/modules/private/router/router");

app.use(bodyParser.json());

app.use("/", router);

app.listen(PORT, () => console.log(`eSignature-app initiated at ${PORT}`));
