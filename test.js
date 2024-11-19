import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'pawmatchvienna@gmail.com', // Your Gmail address
    pass: 'akzdkabbfsiqzpdf', // App-specific password
  },
});

const mailOptions = {
  from: 'pawmatchvienna@gmail.com',
  to: 'sebi.speiser@gmx.net',
  subject: 'Test Email',
  text: 'Hello world!',
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    return console.error(err);
  }
  console.log('Email sent:', info.response);
});
