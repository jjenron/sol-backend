const nodemailer = require('nodemailer');

module.exports = async function sendFallback(texto) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.BOT_EMAIL,
      pass: process.env.BOT_EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.BOT_EMAIL,
    to: 'patagoniaserverbot@gmail.com',
    subject: 'SOL - Mensaje no reconocido',
    text: `Frase sin intención detectada: "${texto}"`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Fallback enviado por mail.');
  } catch (error) {
    console.error('Error enviando mail de fallback:', error);
  }
};