const express = require('express');
const bodyParser = require('body-parser');
const fallbackMailer = require('./fallbackMailer');
const { detectIntentFromText } = require('./dialogflowClient');
const { sendWhatsappMessage } = require('./whatsappSender');

const app = express();
app.use(bodyParser.json());

app.post('/360webhook', async (req, res) => {
  try {
    const messages = req.body?.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.warn("⚠️ Mensaje de WhatsApp sin contenido válido:", JSON.stringify(req.body));
      return res.sendStatus(200);
    }

    const message = messages[0]?.text?.body;
    const from = messages[0]?.from;

    console.log("📩 MENSAJE RECIBIDO DE WHATSAPP:", message);

    if (!message || !from) return res.sendStatus(200);

    const dialogflowResponse = await detectIntentFromText(message, from);
    const reply = dialogflowResponse || "Gracias por tu mensaje.";

    await sendWhatsappMessage(from, reply);

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
