const loginHelper = require("../helper/loginHelper");

const createToken = async (req) => {
  const data = await loginHelper.getData(req);

  const exp = await loginHelper.stamp2Date(data.exp);
  const gen = await loginHelper.stamp2Date(data.iat);

  const token = await loginHelper.createToken(data);

  return { generatedAtUTC: gen, expirationTimeUTC: exp, token: token };
};

module.exports = {
  createToken,
};
