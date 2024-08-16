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

async function Mailer(token, subject, to) {
  const info = await transporter.sendMail({
    from: '"Afriqloan Services" <info@reglerservices.com>',
    to: to,
    subject: subject,
    text: "Welcome to Afriqloan, your trusted platform for financial and property handling",
    html: `<div>Welcome to Afriqloan<br /><span>Kindly click on the provided link to activate your account.</span><br />Kindly note that the link will expire in 2hrs.<br /><a href="${process.env.SITE_URL}/account/activation?token=${token}" target="_blank">Activation Link</a><p>The AfriqLoan Team</p></div>`,
  });

  console.log(info.messageId);

}

export default Mailer