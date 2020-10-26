const loginHelper = require("../helper/loginHelper");
const axios = require("axios");

const createJwtToken = async () => {
  const data = await loginHelper.getData();

  const token = await loginHelper.createToken(data);

  return token;
};

const createAccessToken = async (jwtToken) => {
  const accessToken = await axios({
    method: "post",
    url: "https://account-d.docusign.com/oauth/token",
    data: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwtToken}`,
  })
    .then((response) => {
      console.log(`Access token created successfully.`)
      return response.data.access_token
    })
    .catch((e) => console.log(e));
    return accessToken
}

module.exports = {
  createJwtToken,
  createAccessToken
};
