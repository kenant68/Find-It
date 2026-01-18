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

  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const resetPasswordService = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePassword(decoded.id, hashed);
};
