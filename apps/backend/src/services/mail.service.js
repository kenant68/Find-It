import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
