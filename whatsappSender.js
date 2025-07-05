const axios = require('axios');

async function sendWhatsappMessage(to, text) {
  const url = 'https://waba-v2.360dialog.io/v1/messages';
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };
  const data = {
    to,
    type: 'text',
    text: { body: text },
  };

  await axios.post(url, data, { headers });
  console.log("📤 RESPUESTA ENVIADA A WHATSAPP:", text);
}

module.exports = { sendWhatsappMessage };