require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const key = process.env.PRIVATE_KEY
const moment = require("moment");
const iss = process.env.INTEGRATION_KEY
const sub = process.env.USERNAME_ID
const aud = process.env.AUD
const scope = process.env.SCOPE 


const getData = () => {
  const now = moment(),
    iat = now.unix(),
    exp = now.add(9 * 60 + 30, "s").unix();

  const data = {
    iss: iss,
    sub: sub,
    iat: iat,
    exp: exp,
    aud: aud,
    scope: scope,
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
