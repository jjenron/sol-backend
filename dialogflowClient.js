const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');  // Usar uuid con nombre

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionClient = new dialogflow.SessionsClient();

async function detectIntentFromText(text, sessionId) {
  const session = sessionId?.toString() || uuidv4();  // <- Forzamos valor siempre
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, session);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: 'es',
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult.fulfillmentText;
}

module.exports = { detectIntentFromText };