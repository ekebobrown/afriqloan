import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: "reglerservices.com",
  port: 465,
  secure: true, 
  auth: {
    user: "info@reglerservices.com",
    pass: process.env.MAILER_PASSWORD,
  },
});

async function Mailer(id, subject, to) {
  const info = await transporter.sendMail({
    from: '"Regler Services " <info@reglerservices.com>',
    to: to,
    subject: subject,
    text: "Welcome to Afriqloan, your trusted platform for financial and property handing",
    html: "<div>Welcome to Afriqloan<br /><span>Kindly click on the provided link to activate your account.</span><br /></div>",
  });

  console.log(info.messageId);

}

export default Mailer