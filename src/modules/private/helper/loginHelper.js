require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const key = "/Users/rubenacevedo/Documents/Projects/serverless/private.key";
const moment = require("moment");

const getData = (req) => {
  const now = moment(),
    iat = now.unix(),
    exp = now.add(9 * 60 + 30, "s").unix();

  const data = {
    iss: req.body.iss,
    sub: req.body.sub,
    iat: iat,
    exp: exp,
    aud: req.body.aud,
    scope: req.body.scope,
  };

  return data;
};

const createToken = (data) => {
  const privateKey = fs.readFileSync(key);

  const token = jwt.sign(data, privateKey, {
    algorithm: "RS256",
  });

  return token;
};

const stamp2Date = (stamp) => {
  const date = new Date(stamp);
  return date;
};

module.exports = {
  getData,
  createToken,
  stamp2Date,
};
