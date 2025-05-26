import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import "./ResetPassword.css";
import "./Global.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Veuillez entrer un nouveau mot de passe.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Une erreur est survenue.");
      } else {
        setShowSuccessPopup(true);
        setNewPassword("");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="white-box">
      <div className="back-arrow" onClick={() => navigate("/")}>
        <FaArrowLeft />
      </div>

      <span className="resetpass-link">Réinitialiser le mot de passe</span>
      <span className="text">
        Veuillez entrer un nouveau mot de passe pour accéder à votre compte.
      </span>

      <form onSubmit={handleReset}>
        <div className="email2-container">
          <div className="email2-icon">
            <AiOutlineLock />
          </div>
          <div className="email2-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div
            className="toggle-password-icon"
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer", paddingLeft: "8px" }}
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="navigation-button" type="submit">
          Réinitialiser
        </button>
      </form>

      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />


      {showSuccessPopup && (
        <div className="popup5-overlay">
          <div className="popup5-content">
            <p>✅ Mot de passe réinitialisé avec succès !</p>
            <div className="popup5-buttons">
              <button onClick={() => navigate("/")}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
