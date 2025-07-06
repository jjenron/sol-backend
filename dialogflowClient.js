const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  projectId: credentials.project_id,
});

async function detectIntentFromText(text, sessionId) {
  try {
    const cleanSessionId = (sessionId || uuidv4()).toString();
    const sessionPath = sessionClient.projectAgentSessionPath(credentials.project_id, cleanSessionId);

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
    return responses[0]?.queryResult?.fulfillmentText || "No se pudo obtener respuesta.";
  } catch (error) {
    console.error("ERROR detectIntentFromText:", error);
    return "Ocurrió un error al procesar tu mensaje.";
  }
}

module.exports = { detectIntentFromText };

