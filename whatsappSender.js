const axios = require('axios');

async function sendWhatsappMessage(to, text) {
  const url = 'https://waba-v2.360dialog.io/messages';  // Cloud API endpoint
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };
  const data = {
    messaging_product: "whatsapp", // requerido por Cloud API
    to,
    type: 'text',
    text: { body: text },
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("📤 RESPUESTA ENVIADA A WHATSAPP:", response.data);
  } catch (error) {
    console.error("❌ ERROR al enviar mensaje de WhatsApp:", error.response?.data || error.message);
  }
}

module.exports = { sendWhatsappMessage };
