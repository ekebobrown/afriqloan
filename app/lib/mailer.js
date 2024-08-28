import { createTransport } from "nodemailer";
import Link from "next/link";

const host = process.env.SMTP_HOST
const user = process.env.SMTP_SENDER_EMAIL
const pass = process.env.SMTP_SENDER_PASSWORD

const transporter = createTransport({
  host: host,
  port: 465,
  secure: true,
  auth: {
    user: user,
    pass: pass,
  },
});

export async function Activation(token, subject, type, to) {
  const info = await transporter.sendMail({
    from: '"Afriqloan Services" <contactus@thevip.company>',
    to: to,
    subject: subject,
    text: "Welcome to Afriqloan, your trusted platform for financial and property handling",
    html: `<div>
              <h5>Welcome to Afriqloan</h5>
              <p>Kindly click on the provided link to ${type==="activation"?'activate your account':'reset your password'}.</p>
              Kindly note that the link will expire in 2hrs.<br />
              <a href="${process.env.SITE_URL}/account/${type==="activation"?'activation?':`password?reset=true&email=${to}&`}token=${token}" target="_blank">${type==="activation"?'Email Activation':'Password Reset'} Link</a>
              <p>The AfriqLoan Team</p>
          </div>`
  });

  console.log(info.messageId)

  return {
    accepted:info.accepted,
    rejected:info.rejected,
    response:info.response,
    messageId:info.messageId
  }
}

export async function Invitation(to, subject, body) {
  const info = await transporter.sendMail({
    from: '"Afriqloan Services" <contactus@thevip.company>',
    to: to,
    subject: subject,
    text: "Welcome to Afriqloan, your trusted platform for financial and property handling",
    html: body,
    attachments: [{
      filename: 'icon.png',
      path: `${process.env.SITE_URL}/icons/50x50/icon.png`,
      cid: 'icon@afriqloan.com'
    }]
  });

  console.log(info.messageId)

  return {
    accepted:info.accepted,
    rejected:info.rejected,
    response:info.response,
    messageId:info.messageId
  }

}