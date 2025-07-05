require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const responder = require('./intents');
const sendFallback = require('./fallbackMailer');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const query = req.body.queryResult.queryText;

  if (intent === 'Default Fallback Intent') {
    await sendFallback(query);
    return res.json({ fulfillmentText: 'Disculpá, no entendí bien 😅 ¿Podés reformularlo?' });
  }

  const respuesta = responder(intent);
  return res.json({ fulfillmentText: respuesta });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sol webhook listening on port ${PORT}`));