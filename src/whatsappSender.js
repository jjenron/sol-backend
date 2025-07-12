const axios = require('axios');

/**
 * Envía un mensaje por WhatsApp vía 360dialog.
 * @param {string} to - Número de teléfono destino (Ej: "5492944150549")
 * @param {string} content - Texto del mensaje o contenido del parámetro
 * @param {boolean} isTemplate - Si true, envía plantilla con parámetro. Si false, envía texto libre.
 * @returns {Promise<{ success: boolean, wamid?: string, wa_id?: string, error?: any }>}
 */
async function sendWhatsappMessage(to, content, isTemplate = true) {
  const url = 'https://waba-v2.360dialog.io/messages';
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };

  let data;

  if (isTemplate) {
    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'respuesta_texto', // Debe estar aprobada en tu cuenta con 1 parámetro
        language: { code: 'es_AR' },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: content }
            ]
          }
        ]
      }
    };
  } else {
    data = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: content }
    };
  }

  try {
    const response = await axios.post(url, data, { headers });

    const wamid = response.data?.messages?.[0]?.id || null;
    const wa_id = response.data?.contacts?.[0]?.wa_id || null;

    console.log(`✅ Mensaje ${isTemplate ? 'plantilla' : 'texto'} enviado a ${wa_id}`);
    console.log(`📨 Message ID: ${wamid}`);

    return { success: true, wamid, wa_id };
  } catch (error) {
    console.error(`❌ Error enviando mensaje ${isTemplate ? 'plantilla' : 'texto'}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

module.exports = { sendWhatsappMessage };
