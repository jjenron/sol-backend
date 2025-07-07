async function sendWhatsappMessage(to, message) {
  const url = 'https://waba-v2.360dialog.io/v1/messages';  // Probar con https://waba.360dialog.io/v1/messages si falla
  const headers = {
    'D360-API-KEY': process.env.D360_API_KEY,
    'Content-Type': 'application/json',
  };

  const data = {
    to,
    ...message,
  };

  console.log("📤 Enviando a WhatsApp:", JSON.stringify(data, null, 2));

  try {
    const res = await axios.post(url, data, { headers });
    console.log("✅ WhatsApp respondió:", res.status, res.data);
  } catch (error) {
    console.error("❌ ERROR EN ENVÍO A WHATSAPP:", error.response?.status, error.response?.data);
  }
}
