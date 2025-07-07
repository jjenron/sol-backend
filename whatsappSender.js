async function sendWhatsappMessage(to, text) {
  const url = 'https://waba-v2.360dialog.io/v1/messages';
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };

  const data = {
    to,
    type: 'template',
    template: {
      namespace: 'cd5544d2_6cc2_4576_b344_2796be7a433d', // lo ves en 360dialog
      name: 'bienvenida', // ej: "respuestabot_inicial"
      language: {
        code: 'es_AR',
        policy: 'deterministic',
      },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text } // si querés enviar `text` como parámetro
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("✅ Plantilla enviada:", response.data);
  } catch (error) {
    console.error("❌ Error al enviar plantilla:", error.response?.data || error.message);
  }
}
