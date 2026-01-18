import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findByEmail,
  updatePassword,
} from "../repositories/users.repository.js";

export const loginService = async (email, password) => {
  console.log('Tentative de login pour email:', email);
  const user = await findByEmail(email);
  console.log('Utilisateur trouvé:', user ? `ID: ${user.id}, Email: ${user.email}` : 'null');

  if (!user) {
    console.log('Erreur: Utilisateur non trouvé');
    throw new Error("INVALID_CREDENTIALS");
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  console.log('Mot de passe correct:', match);

  if (!match) {
    console.log('Erreur: Mot de passe incorrect');
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  console.log('Token généré avec succès pour user ID:', user.id);
  return token;
};

export const resetPasswordService = async (token, newPassword) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hashed = await bcrypt.hash(newPassword, 10);
  await updatePassword(decoded.id, hashed);
};
