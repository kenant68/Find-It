import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../button/Button.jsx";
import Input from "../Input/Input.jsx";
import styles from "./AuthcardRegister.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";

const AuthcardRegister = ({ title }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
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
        email: formData.email,
        password: formData.password
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
              name="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              name="Mot de passe"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Input
              name="Confirmez le mot de passe"
              type="password"
              value={formData.confirmPassword}
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
