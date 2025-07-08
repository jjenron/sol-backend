const express = require('express');
const bodyParser = require('body-parser');
const fallbackMailer = require('./fallbackMailer');
const { detectIntentFromText } = require('./dialogflowClient');
const { sendWhatsappMessage } = require('./whatsappSender');

const app = express();
app.use(bodyParser.json());

app.post('/360webhook', async (req, res) => {
  try {
   const change = req.body?.entry?.[0]?.changes?.[0]?.value;

if (!change || !change.messages || !Array.isArray(change.messages) || change.messages.length === 0) {
  return res.sendStatus(200); // ignorar eventos sin mensajes (ej. status)
}

const message = change.messages[0]?.text?.body;
const from = change.messages[0]?.from;

if (!message || !from) {
  return res.sendStatus(200); // mensaje mal formado o sin texto
}


    const message = messages[0]?.text?.body;
    const from = messages[0]?.from;

    console.log("📩 MENSAJE RECIBIDO DE WHATSAPP:", message);

    if (!message || !from) return res.sendStatus(200);

    const dialogflowResponse = await detectIntentFromText(message, from);
    const reply = dialogflowResponse || "Gracias por tu mensaje.";

    // Primero intenta enviar mensaje libre
    let sent = await sendWhatsappMessage(from, reply, false); // false = tipo texto

    // Si falla, reintenta con plantilla
    if (!sent.success && sent.error?.error?.code === 400) {
      console.warn("⛔️ Mensaje fuera de ventana de sesión. Reintentando con plantilla.");
      sent = await sendWhatsappMessage(from, reply, true); // true = tipo plantilla
    }

    // Si aún falla, logea y manda aviso
    if (!sent.success) {
      await fallbackMailer.send(`❌ No se pudo enviar el mensaje a ${from}: ${JSON.stringify(sent.error)}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("ERROR /360webhook:", error);
    await fallbackMailer.send(`ERROR /360webhook: ${JSON.stringify(req.body)}`);
    res.sendStatus(200);
  }
});

app.listen(3000, () => {
  console.log("Sol webhook listening on port 3000");
});
