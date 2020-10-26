const router = require("express").Router();
const controller = require("../controller/controller");
const loginController = require("../controller/loginController");

router.post("/createEnvelope", async (req, res) => {
  console.log("Creating access token...")
  const jwtToken = await loginController.createJwtToken();

  const accessToken = await loginController.createAccessToken(jwtToken)

  console.log("Creating envelope...")
  const result = await controller.createRequest(req.body, accessToken);
  if (result.status !== 200) {
    res.status(result.status);
    res.send({ error: result.error });
  } else
    res.send({
      status: "sent",
      envelopeId: result.envelopeId,
    });

  console.log(`Envelope created successfully, id: ${result.envelopeId}`)
    
});

router.get(`/access`, async (req, res) => {
  console.log(res);
  res.send("OK");
});

router.get('/check', async (req, res) => {
  console.log("Creating access token...")
  const jwtToken = await loginController.createJwtToken();

  const accessToken = await loginController.createAccessToken(jwtToken)
  

    console.log("Checking envelope status...")
  const result = await controller.getEnvelope(req.body, accessToken);
  if (result.status !== 200) {
    res.status(result.status);
    res.send({ error: result.error });
  } else
    res.send({
      status: result.data.status,
    });
    console.log(`Envelope status: ${result.data.status}`)
})

module.exports = router;

// link to get auth
// https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=&redirect_uri=http://localhost:5000/access