const Joi = require("joi");
const pdf =
  "/Users/rubenacevedo/Documents/Projects/serverless/DocuSign/World_Wide_Corp_lorem.pdf";
const docusign = require("docusign-esign");
const fs = require("fs");

const requestSchema = Joi.object({
  signerEmail: Joi.string().min(5).max(50).required(),
  signerName: Joi.string().min(3).max(50).required(),
  ccEmail: Joi.string().min(5).max(50).required(),
  ccName: Joi.string().min(3).max(50).required(),
  accessToken: Joi.string().min(3).max(1000).required(),
  accountId: Joi.string().min(3).max(1000).required(),
});

const validateRequest = (request) => {
  const validation = requestSchema.validate(request);
  if (!validation.error) {
    return {
      status: 200,
      request,
    };
  } else return { status: 500, error: validation.error.details[0].message };
};

const requestObject = (request) => {
  return {
    signerEmail: request.signerEmail,
    signerName: request.signerName,
    ccEmail: request.ccEmail,
    ccName: request.ccName,
    status: "sent",
  };
};

const encoder = (fileName) => {
  const file = fs.readFileSync(fileName);
  const encodedFile = Buffer.from(file).toString("base64");
  return encodedFile;
};

const getDocument = () => {
  let doc = new docusign.Document();
  doc.documentBase64 = encoder(pdf);
  doc.name = "Order of acknowledgment";
  doc.fileExtension = "pdf";
  doc.documentId = "1";
  return doc;
};

const createEnvelope = (envelopeArgs, document, recipient) => {
  let envelope = new docusign.EnvelopeDefinition();
  envelope.emailSubject = "Please sign this document set";
  envelope.documents = [document];
  envelope.recipients = recipient;
  envelope.status = envelopeArgs.status;
  return envelope;
};

const createRecipient = (signer) => {
  let recipient = docusign.Recipients.constructFromObject({
    signers: [signer.signer],
    carbonCopies: [signer.cc],
  });
  return recipient;
};

const createSigner = (envelopeArgs) => {
  let signer = docusign.Signer.constructFromObject({
    email: envelopeArgs.signerEmail,
    name: envelopeArgs.signerName,
    recipientId: "1",
    routingOrder: "1",
  });

  let cc = new docusign.CarbonCopy();
  cc.email = envelopeArgs.ccEmail;
  cc.name = envelopeArgs.ccName;
  cc.routingOrder = "2";
  cc.recipientId = "2";

  const signerObj = { signer, cc };

  return signerObj;
};

const createTabs = (signer) => {
  let signHere = docusign.SignHere.constructFromObject({
    anchorString: "**signature_1**",
    anchorYOffset: "10",
    anchorUnits: "pixels",
    anchorXOffset: "20",
  });

  let signerTabs = docusign.Tabs.constructFromObject({
    signHereTabs: [signHere],
  });

  signer.signer.tabs = signerTabs;
  return signer;
};

module.exports = {
  validateRequest,
  requestObject,
  getDocument,
  createEnvelope,
  createSigner,
  createTabs,
  createRecipient,
  encoder,
};
