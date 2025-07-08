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

    // Ignorar eventos sin mensajes (ej: statuses, delivery, etc.)
    if (!change || !change.messages || !Array.isArray(change.messages) || change.messages.length === 0) {
      return res.sendStatus(200);
    }

    const from = change.messages[0]?.from;
    const textBody = change.messages[0]?.text?.body;

    if (!textBody || !from) {
      return res.sendStatus(200);
    }

    console.log("📩 MENSAJE RECIBIDO DE WHATSAPP:", textBody);

    const dialogflowResponse = await detectIntentFromText(textBody, from);
    const reply = dialogflowResponse || "Gracias por tu mensaje.";

    // Intento inicial con texto libre
    let sent = await sendWhatsappMessage(from, reply, false);

    // Si falla por fuera de ventana, reintenta con plantilla
    if (!sent.success && sent.error?.error?.code === 400) {
      console.warn("⛔️ Mensaje fuera de ventana de sesión. Reintentando con plantilla.");
      sent = await sendWhatsappMessage(from, reply, true);
    }

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

