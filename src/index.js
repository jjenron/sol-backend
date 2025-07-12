const express = require('express');
const bodyParser = require('body-parser');
const fallbackMailer = require('./fallbackMailer');
const { detectIntentFromText } = require('./dialogflowClient');
const { sendWhatsappMessage } = require('./whatsappSender');
const chatWithGPT = require('./gptClient'); // 💡 Este archivo exporta directamente la función
const { getSession, updateSession } = require('./sessionManager');

const app = express();
app.use(bodyParser.json());

// Cache en memoria de últimos mensajes por número
const messageCache = new Map(); // key: phone number, value: { messageId, text, timestamp }

app.post('/360webhook', async (req, res) => {
  try {
    const change = req.body?.entry?.[0]?.changes?.[0]?.value;

    if (!change || !change.messages || !Array.isArray(change.messages) || change.messages.length === 0) {
      return res.sendStatus(200);
    }

    const message = change.messages[0];
    const from = message?.from;
    const textBody = message?.text?.body;
    const messageId = message?.id;

    if (!textBody || !from || !messageId) {
      return res.sendStatus(200);
    }

    console.log("📩 MENSAJE RECIBIDO DE WHATSAPP:", textBody);

    // Verificamos en cache si ya se procesó este ID de mensaje
    const lastMessage = messageCache.get(from);
    if (lastMessage?.messageId === messageId) {
      console.log("⚠️ Mensaje ya procesado (ID repetido). Ignorado.");
      return res.sendStatus(200);
    }

    // Guardamos en cache
    messageCache.set(from, { messageId, text: textBody, timestamp: Date.now() });

    const dialogflowResponse = await detectIntentFromText(textBody, from);
    const intentName = dialogflowResponse?.intent?.displayName;
    const isFallback = dialogflowResponse?.intent?.isFallback || false;

    console.log("🤖 INTENT DETECTADO:", intentName || 'undefined');

    let reply = dialogflowResponse?.fulfillmentText;

    // Si no hay respuesta de Dialogflow, o es fallback, usar GPT
    if (!reply || isFallback || intentName === 'Default Fallback Intent' || !intentName) {
      console.log("🌐 Redirigiendo a ChatGPT por falta de intent claro o fallback...");

      const session = getSession(from);
      const gptResponse = await chatWithGPT(textBody, session);

      // Actualizamos la sesión con el nuevo mensaje
      updateSession(from, {
        role: 'user',
        content: textBody
      });
      updateSession(from, {
        role: 'assistant',
        content: gptResponse || "No estoy seguro, pero podés preguntarme de otra forma."
      });

      reply = gptResponse || "No estoy seguro, pero podés preguntarme de otra forma.";
    }

    let sent = await sendWhatsappMessage(from, reply, false);

    if (!sent.success && sent.error?.error?.code === 400) {
      console.warn("⛔️ Fuera de ventana. Reintentando con plantilla...");
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



