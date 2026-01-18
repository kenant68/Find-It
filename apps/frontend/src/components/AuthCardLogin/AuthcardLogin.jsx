import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../button/Button.jsx";
import styles from "./AuthcardLogin.module.css";
import Input from "../Input/Input.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/auth.jsx";

const AuthcardLogin = ({ title }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Tentative de connexion:', { email, password, emailEmpty: !email, passwordEmpty: !password });

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Erreur de connexion");
      }
    } catch (err) {
      setError("Erreur de connexion. Vérifiez vos identifiants.");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              name="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <Button
              text={loading ? "Connexion..." : "Se connecter"}
              disabled={loading}
            />
          </form>

          <div className={styles.linksRow}>
            <Link to="/register" className={styles.linkToRegister}>
              Créer un compte
            </Link>
            <Link to="/" className={styles.passwdForgotten}>
              Mot de passe oublié
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AuthcardLogin;
