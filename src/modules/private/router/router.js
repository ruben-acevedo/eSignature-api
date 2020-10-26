const router = require("express").Router();
const controller = require("../controller/controller");
const loginController = require("../controller/loginController");
const axios = require("axios");

router.post("/create", async (req, res) => {
  const result = await controller.createRequest(req.body);
  if (result.status !== 200) {
    res.status(result.status);
    res.send({ error: result.error });
  } else
    res.send({
      status: "sent",
      envelopeId: result.envelopeId,
    });
});

router.get(`/access`, async (req, res) => {
  console.log(res);
  res.send("OK");
});

router.get('/check', async (req, res) => {
  const result = await controller.getEnvelope(req.body);
  if (result.status !== 200) {
    res.status(result.status);
    res.send({ error: result.error });
  } else
    res.send({
      status: result.data.status,
    });
})

router.post("/login", async (req, res) => {
  const token = await loginController.createToken(req);

  axios({
    method: "post",
    url: "https://account-d.docusign.com/oauth/token",
    data: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token.token}`,
  })
    .then((response) => res.send(response.data))
    .catch((e) => console.log(e));
});

module.exports = router;

// link to get auth
// https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=&redirect_uri=http://localhost:5000/access