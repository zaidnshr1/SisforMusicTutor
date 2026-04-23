import nodemailer from "nodemailer"

var transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  auth: {
    user: process.env.USER,
    pass: process.env.PASSWORD,
  },
});

export default transport;