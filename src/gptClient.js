const { OpenAI } = require('openai');
const { getSystemPrompt } = require('./systemPrompt');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function consultarChatGPT(mensajeUsuario) {
  const systemPrompt = getSystemPrompt();

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: mensajeUsuario,
        },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error('❌ Error al consultar ChatGPT:', error);
    return 'Lo siento, hubo un error al procesar tu mensaje.';
  }
}

module.exports = { chatWithGPT: consultarChatGPT };

