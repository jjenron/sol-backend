const dialogflow = require('@google-cloud/dialogflow');
const { v4: uuidv4 } = require('uuid');

const base64Key = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const credentials = JSON.parse(Buffer.from(base64Key, 'base64').toString('utf-8'));

const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    client_email: credentials.client_email,
    private_key: credentials.private_key,
  },
  projectId: credentials.project_id,
});

async function detectIntentFromText(text, sessionId) {
  try {
    // Validación y limpieza del sessionId
    const cleanSessionId = (sessionId ? sessionId.toString() : uuidv4());

    // Genera path de sesión
    const sessionPath = sessionClient.projectAgentSessionPath(
      credentials.project_id,
      cleanSessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: 'es-419',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    return responses[0]?.queryResult?.fulfillmentText || "No se pudo obtener respuesta.";
  } catch (error) {
    console.error("❌ ERROR detectIntentFromText:", error);
    return "Ocurrió un error al procesar tu mensaje.";
  }
}

module.exports = { detectIntentFromText };

