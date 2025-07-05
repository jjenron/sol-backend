const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

const projectId = process.env.DIALOGFLOW_PROJECT_ID;
const sessionClient = new dialogflow.SessionsClient();

async function detectIntentFromText(text, sessionId) {
  try {
    const cleanSessionId = (sessionId || uuidv4()).toString();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, cleanSessionId);

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
