import React, { useState } from "react";
import styles from "./Login.module.css";
import Logo from "../../components/icons/Logo.jsx";
import { Link } from "react-router-dom";
import Input from "../../components/Input/Input.jsx";
import Button from "../../components/button/Button.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSent(true);
      } else {
        setError("Une erreur est survenue");
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
            Mot de passe oublié
          </h1>

          {sent ? (
            <div style={{ textAlign: "center", color: "white" }}>
              <p style={{ marginBottom: "20px" }}>
                Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
              </p>
              <Link to="/login" style={{ color: "#b5238a" }}>
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "20px", fontSize: "14px" }}>
                Entrez votre adresse email pour recevoir un lien de réinitialisation.
              </p>
              
              <Input
                name="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div style={{ color: "#ff6b6b", marginBottom: "10px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <Button
                text={loading ? "Envoi..." : "Envoyer le lien"}
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

export default ForgotPassword;
