const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patagoniaserverbot@gmail.com',
    pass: process.env.MAIL_PASSWORD,
  },
});

async function send(message) {
  await transporter.sendMail({
    from: 'Sol bot <patagoniaserverbot@gmail.com>',
    to: 'patagoniaserverbot@gmail.com',
    subject: 'Mensaje no reconocido por Sol',
    text: message,
  });
}

module.exports = { send };