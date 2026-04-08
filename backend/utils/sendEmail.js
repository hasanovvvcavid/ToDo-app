import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Transporter yaradaq
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Google mail xidməti
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }

  });

  // Göndəriləcək mail-in məzmunu
  const mailOptions = {
    from: `"ToDo App Team" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // Maili göndərək
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
