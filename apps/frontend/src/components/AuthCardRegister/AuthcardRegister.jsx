import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button.jsx";
import Input from "../Input/Input.jsx";
import styles from "./AuthcardRegister.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";

const AuthcardRegister = ({ title }) => {
  const [formData, setFormData] = useState({
    "Nom d'utilisateur FACEIT": "",
    "Email": "",
    "Mot de passe": "",
    "Confirmez le mot de passe": ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData["Nom d'utilisateur FACEIT"] || !formData["Email"] || !formData["Mot de passe"] || !formData["Confirmez le mot de passe"]) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    if (formData["Mot de passe"] !== formData["Confirmez le mot de passe"]) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData["Nom d'utilisateur FACEIT"].length < 3) {
      setError("Le nom d'utilisateur doit contenir au moins 3 caractères");
      return false;
    }

    if (formData["Mot de passe"].length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData["Email"])) {
      setError("Veuillez entrer une adresse email valide");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await register({
        username: formData["Nom d'utilisateur FACEIT"],
        email: formData["Email"],
        password: formData["Mot de passe"]
      });

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className={styles.card}>
        <div className={styles.container}>
          <h1 className={styles.h1}>{title}</h1>

          <form onSubmit={handleSubmit}>
            <Input
              name="Nom d'utilisateur FACEIT"
              type="text"
              value={formData["Nom d'utilisateur FACEIT"]}
              onChange={handleChange}
              required
            />
            <Input
              name="Email"
              type="email"
              value={formData["Email"]}
              onChange={handleChange}
              required
            />
            <Input
              name="Mot de passe"
              type="password"
              value={formData["Mot de passe"]}
              onChange={handleChange}
              required
            />
            <Input
              name="Confirmez le mot de passe"
              type="password"
              value={formData["Confirmez le mot de passe"]}
              onChange={handleChange}
              required
            />

            {error && (
              <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <Button
              className={styles["container-button"]}
              text={loading ? "Inscription..." : "S'inscrire"}
              disabled={loading}
            />
          </form>

          <Link to="/login" className={styles.linkToLogin}>
            J'ai déjà un compte
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AuthcardRegister;
