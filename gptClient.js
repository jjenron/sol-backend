
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function chatWithGPT(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: message }]
    });

    return completion.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error("❌ Error en chatWithGPT:", error);
    return null;
  }
}

module.exports = { chatWithGPT };
