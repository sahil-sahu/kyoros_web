import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    // secure: false, // true for port 465, false for other ports
    auth: {
      user: "postmaster@sandboxc7b43005040443d886ea2962a7639a53.mailgun.org",
      pass: "1d02a9891244c17b061d8f1283787e50-826eddfb-015d67f2",
    },
})

const sendEmail = transporter.sendMail;

export default sendEmail;