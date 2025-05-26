import React, { useState, useEffect } from "react";
import {
  FaRegEdit,
  FaPlusSquare,
  FaEye,
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Welcome_visiteur.css";
import "./Global.css";

import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/", { state: { message: "Veuillez vous connecter." } });
    }
  }, [navigate]);

  const toggleAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { state: { message: "Déconnexion réussie" } });
  };
  const getInitials = () => {
    if (user?.prenom && user?.nom) {
      return (
        user.prenom.trim().charAt(0).toUpperCase() +
        user.nom.trim().charAt(0).toUpperCase()
      );
    } else if (user?.nom) {
      return user.nom.trim().substring(0, 2).toUpperCase();
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "??";
  };
  return (
    <div className="white-box">
      <span className="bienvenue1">Bienvenue </span>

      <button
        className="action-button11 consulter-question-button1"
        onClick={() => navigate("/ConsulterUtilisateur")}
      >

        <FaEye className="button-icon1" />
        <span className="button-text1">Consulter questions / catégories </span>
      </button>
      <button
        className="action-button11 consulter-test-button1"
        onClick={() => navigate("/ConsulterTest")}
      >
        <FaEye className="button-icon1" />
        <span className="button-text1">Consulter les tests </span>
      </button>

      {user ? (
        <div className="account-initial-circle" onClick={toggleAccountInfo} title={user.email}>
          {getInitials()}
        </div>
      ) : null}

      {/* Informations du compte */}
      {showAccountInfo && user && (
        <div className="account-info">
          <p>Nom : {user.nom}  {user.prenom}</p>
          <p>Email : {user.email}</p>

          <button
            className="account-button"
            onClick={() => navigate("/manage-account")}
          >
            <FaUserCog className="account-icon-btn" />
            <span className="button-textt">Gérer votre compte</span>
          </button>

          <button className="account-button" onClick={handleLogout}>
            <FaSignOutAlt className="account-icon-btn" />
            <span className="button-textt">Déconnecter</span>
          </button>
        </div>
      )}

      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

    </div>
  );
};

export default Welcome;
