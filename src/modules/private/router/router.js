const router = require("express").Router();
const controller = require("../controller/controller");
const loginController = require("../controller/loginController");

router.post("/createEnvelope", async (req, res) => {
  console.log("Creating access token...")
  const jwtToken = await loginController.createJwtToken();

  const accessToken = await loginController.createAccessToken(jwtToken)

  console.log("Creating envelope...")
  const result = await controller.createRequest(req.body, accessToken);

  res.send(result)
    
});

module.exports = router;

// link to get auth
// https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=YOUR_USER_ID&redirect_uri=ANYCALLBACK_URL