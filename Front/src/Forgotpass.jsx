import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Forgotpass.css";
import "./Global.css";

const Forgotpass = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Veuillez entrer votre adresse email.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Une erreur est survenue.");
      } else {
        setShowSuccessPopup(true);
        setEmail("");
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

      <span className="forgotpass-link">Mot de passe oublié ?</span>
      <span className="text">
        Veuillez saisir votre email de connexion afin de recevoir le lien de réinitialisation de votre mot de passe.
      </span>

      <form onSubmit={handleSubmit}>
        <div className="email2-container">
          <div className="email2-icon">
            <AiOutlineMail />
          </div>
          <div className="email2-input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="navigation-button" type="submit">
          Envoyer le lien
        </button>
      </form>

      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />


      {showSuccessPopup && (
        <div className="popup4-overlay">
          <div className="popup4-content">
            <p>✅ Email envoyé ! Veuillez vérifier votre boîte de réception.</p>
            <div className="popup4-buttons">
              <button onClick={() => navigate("/")}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forgotpass;
