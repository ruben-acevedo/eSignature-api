require("dotenv").config();
const Joi = require("joi");
const template = process.env.TEMPLATE;
const docusign = require("docusign-esign");
const fs = require("fs");
const returnUrl = process.env.RETURN_URL
const user = process.env.USERNAME_ID

const requestSchema = Joi.object({
  signerEmail: Joi.string().min(5).max(50).required(),
  signerName: Joi.string().min(3).max(50).required(),
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
  doc.documentBase64 = encoder(template);
  doc.name = "Order of acknowledgment";
  doc.fileExtension = "pdf";
  doc.documentId = "1";
  return doc;
};

const createEnvelope = (envelopeArgs, document, recipient, eventNotification) => {
  let envelope = new docusign.EnvelopeDefinition();
  envelope.emailSubject = "Please sign this document set";
  envelope.documents = [document];
  envelope.recipients = recipient;
  envelope.status = envelopeArgs.status;
  // envelope.EventNotification = eventNotification

  return envelope;
};

const createEventNotification = () => {
  let notification = new docusign.EventNotification()
  notification.envelopeEventStatusCode = 'completed'
  notification.url = 'https://enigmatic-reef-77313.herokuapp.com/create'
  return notification
}

const createRecipient = (signer) => {
  let recipient = docusign.Recipients.constructFromObject({
    signers: [signer.signer],
  });
  return recipient;
};

const createSigner = (envelopeArgs) => {
  let signer = docusign.Signer.constructFromObject({
    email: envelopeArgs.signerEmail,
    name: envelopeArgs.signerName,
    clientUserId: signerId,
    recipientId: "1",
  });

  const signerObj = {signer};

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

const createRecipientViewRequest = (args) => {
  let viewRequest = new docusign.RecipientViewRequest();

    viewRequest.returnUrl = returnUrl;
    viewRequest.authenticationMethod = 'none';
    viewRequest.email = args.signerEmail;
    viewRequest.userName = args.signerName;
    viewRequest.clientUserId = user;

    return viewRequest
}

module.exports = {
  validateRequest,
  requestObject,
  getDocument,
  createEnvelope,
  createSigner,
  createTabs,
  createRecipient,
  encoder,
  createEventNotification,
  createRecipientViewRequest
};
