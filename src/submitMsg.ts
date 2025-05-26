//https://pt.rakko.tools/tools/129/
//https://myaccount.google.com/security

const nodemailer: any = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'xsantos.marlonx@gmail.com',
    pass: 'sua-senha'
  }
});