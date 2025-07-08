// whatsappSender.js

const axios = require('axios');

async function sendWhatsappMessage(to, templateName = 'prueba', languageCode = 'es_AR') {
  const url = 'https://waba-v2.360dialog.io/messages';
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };

  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [], // Agregá si tenés variables dinámicas en la plantilla
    },
  };

  try {
    const response = await axios.post(url, data, { headers });

    const wamid = response.data?.messages?.[0]?.id || null;
    const wa_id = response.data?.contacts?.[0]?.wa_id || null;

    console.log(`✅ Template sent successfully to ${wa_id}`);
    console.log(`📨 WhatsApp Message ID: ${wamid}`);

    return { success: true, wamid, wa_id };
  } catch (error) {
    console.error("❌ Error sending WhatsApp template:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

module.exports = { sendWhatsappMessage };

