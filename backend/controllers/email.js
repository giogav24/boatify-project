const nodemailer= require('nodemailer');
const config= require('../config');

const sendEmail = async (options) => {
  try {
    // Creazione del trasportatore di nodemailer
    const transporter = nodemailer.createTransport({
      service: config.EMAIL_SERVICE,
      auth: {
        user: config.EMAIL_USERNAME,
        pass: config.EMAIL_PASSWORD,
      },
    });

    // Informazioni del destinatario della mail
    const mailOptions = {
      from: config.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html, 
    };

    // Invio dell'email
    await transporter.sendMail(mailOptions);
    console.log('Email inviata con successo');
    
  } catch (error) {
    console.error('Errore durante l\'invio dell\'email:', error.message);
    throw new Error('Errore durante l\'invio dell\'email');
  }
};

module.exports = sendEmail;
