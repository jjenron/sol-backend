const { OpenAI } = require('openai');
const { getSystemPrompt } = require('./systemPrompt');
const { getSessionHistory, appendToSession } = require('./sessionManager');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithGPT(userMessage, sessionId) {
  const systemPrompt = getSystemPrompt();

  // Obtener historial de la sesión (si existe)
  const history = getSessionHistory(sessionId);

  // Construir los mensajes con el historial más el nuevo input
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Podés usar 'gpt-3.5-turbo' si preferís menos costo
      messages,
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content;

    // Guardar el intercambio en el historial
    appendToSession(sessionId, { role: 'user', content: userMessage });
    appendToSession(sessionId, { role: 'assistant', content: response });

    return response;
  } catch (error) {
    console.error('Error consultando a ChatGPT:', error);
    throw error;
  }
}

module.exports = { chatWithGPT };
