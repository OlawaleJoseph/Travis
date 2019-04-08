import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import smtpTransport from 'nodemailer-smtp-transport';


dotenv.config();

const sendMail = async (email, subject, message) => {
  if(!email){ return null}
  const transport = nodemailer.createTransport(smtpTransport({
        service:"gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: 'bankaadc@gmail.com',
            pass: process.env.mailPassword,
        },
        tls: {
        rejectUnauthorized: false,
        },
    }));

  const mailOptions = {
    from: '"Olawale" <bankaadc@gmail.com>',
    to: email,
    subject,
    text: message,
  };
  try {
    const mail = await transport.sendMail(mailOptions);
    if (mail) {
      return mail
    }
  } catch (err) {
    if(err)console.log(err);
    return null;
  }
};

export default sendMail;