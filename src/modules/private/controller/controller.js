const helper = require("../helper/helper");
const basePath = "https://demo.docusign.net/restapi";
const docusign = require("docusign-esign");

const createRequest = async (request) => {
  const validateRequest = await helper.validateRequest(request);
  if (validateRequest.status != 200) return validateRequest;

  const envelopeArgs = await helper.requestObject(request);

  const document = await helper.getDocument();

  const signer = await helper.createSigner(envelopeArgs);

  const signerWtabs = await helper.createTabs(signer);

  const recipient = await helper.createRecipient(signerWtabs);

  const envelope = await helper.createEnvelope(
    envelopeArgs,
    document,
    recipient
  );

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(basePath);
  dsApiClient.addDefaultHeader(
    "Authorization",
    "Bearer " + request.accessToken
  );

  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  results = await envelopesApi.createEnvelope(request.accountId, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;

  return { status: 200, envelopeId: envelopeId };
};

module.exports = {
  createRequest,
};
