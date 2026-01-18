import nodemailer from "nodemailer";


const port = Number(process.env.MAIL_PORT);
const secure = process.env.MAIL_SECURE === 'true' || port === 465;

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: port,
  secure: secure,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendResetPasswordMail(to, link) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: "Réinitialisation du mot de passe - Find-It",
    html: `
      <p>Tu as demandé une réinitialisation de mot de passe pour <b>Find-It</b>.</p>
      <p>Pour réinitialiser ton mot de passe, clique sur le lien ci-dessous :</p>
      <a href="${link}">${link}</a>
      <p>Si tu n'as pas demandé cette réinitialisation, ignore ce mail.</p>
    `,
  });

  console.log("Mail envoyé :", info.messageId);
  console.log("Preview URL (Ethereal) :", nodemailer.getTestMessageUrl(info));
}
