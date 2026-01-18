import React, { useState } from "react";
import styles from "./Login.module.css";
import Logo from "../../components/icons/Logo.jsx";
import { Link, useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/button/Button.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError("Le lien est invalide ou a expiré");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Link to={"/"}>
        <Logo />
      </Link>
      <div className={styles.cardContainer}>
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          boxSizing: "border-box"
        }}>
          <h1 style={{
            color: "white",
            fontSize: "24px",
            marginBottom: "20px",
            textAlign: "center",
            fontFamily: "Orbitron, sans-serif"
          }}>
            Nouveau mot de passe
          </h1>

          {success ? (
            <div style={{ textAlign: "center", color: "white" }}>
              <p style={{ marginBottom: "20px", color: "#4caf50" }}>
                Mot de passe réinitialisé avec succès !
              </p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                Redirection vers la connexion...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                name="Nouveau mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              <Input
                name="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div style={{ color: "#ff6b6b", marginBottom: "10px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <Button
                text={loading ? "Réinitialisation..." : "Réinitialiser"}
                disabled={loading}
              />

              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <Link to="/login" style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
