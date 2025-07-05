const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const projectId = process.env.DIALOGFLOW_PROJECT_ID;

const sessionClient = new dialogflow.SessionsClient();

async function detectIntentFromText(text, sessionId) {
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId || uuid.v4());
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
// trigger deploy
