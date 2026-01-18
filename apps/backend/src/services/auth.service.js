import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findByEmail,
  updatePassword,
} from "../repositories/users.repository.js";

export const loginService = async (email, password) => {
  const user = await findByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) throw new Error("INVALID_CREDENTIALS");

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
    throw new Error("JWT_SECRET non configuré - contactez l'administrateur");
  }

  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const resetPasswordService = async (token, newPassword) => {

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === '') {
    throw new Error("JWT_SECRET non configuré - contactez l'administrateur");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePassword(decoded.id, hashed);
};
