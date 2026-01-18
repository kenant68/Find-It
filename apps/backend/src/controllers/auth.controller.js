import jwt from "jsonwebtoken";
import { loginService, resetPasswordService } from "../services/auth.service.js";
import { sendResetPasswordMail } from "../services/mail.service.js";
import { findByEmail } from "../repositories/users.repository.js";

export const login = async (req, res) => {
  try {
    const token = await loginService(req.body.email, req.body.password);
    res.json({ token });
  } catch {
    res.status(401).json({ message: "Identifiants invalides" });
  }
};

export const forgotPassword = async (req, res) => {
  const user = await findByEmail(req.body.email);
  if (!user) return res.sendStatus(200);

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const link = `http://localhost:4000/reset-password/${token}`;
  await sendResetPasswordMail(user.email, link);

  res.sendStatus(200);
};

export const resetPassword = async (req, res) => {
  try {
    await resetPasswordService(req.body.token, req.body.password);
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
};

console.log("JWT_SECRET =", process.env.JWT_SECRET);

