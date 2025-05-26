// Importation de React et de hooks utiles
import React, { useState, useEffect } from "react";

// Importation des icônes utilisées dans le formulaire
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible
} from "react-icons/ai";

// Importation des fichiers CSS pour le style
import "./Login.css";
import "./Global.css";

// Importation des hooks de navigation et de gestion d’état de la route
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  // Initialisation des hooks pour naviguer et récupérer les données passées via la navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Définition des états pour les champs du formulaire et pour la logique d'affichage
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Affiche/cache le mot de passe
  const [message, setMessage] = useState("");

  // Gestion des erreurs individuelles (email, mot de passe, erreur globale)
  const [errors, setErrors] = useState({
    email: "",
    mot_de_passe: "",
    global: ""
  });

  // useEffect pour afficher un message temporaire s'il vient d'une autre page (ex : après déconnexion)
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      const timer = setTimeout(() => setMessage(""), 3000); // Efface le message après 3 sec
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fonction appelée au clic sur le bouton "Se connecter"
  const handleLogin = async () => {
    // Réinitialise les erreurs
    setErrors({ email: "", mot_de_passe: "", global: "" });

    // Affiche les données dans la console pour debug
    console.log("Envoi des données :", { email, mot_de_passe: motDePasse });

    try {
      // Envoie les données au backend via une requête POST
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
      });

      const data = await response.json();
      console.log("Réponse backend :", data);

      // Si la réponse est invalide (erreur de validation)
      if (!response.ok) {
        if (data.field === "email") {
          setErrors((prev) => ({ ...prev, email: data.message }));
        } else if (data.field === "mot_de_passe") {
          setErrors((prev) => ({ ...prev, mot_de_passe: data.message }));
        } else {
          setErrors((prev) => ({ ...prev, global: data.message }));
        }
      } else {
        // Stocke les infos de l'utilisateur dans le localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirige l’utilisateur selon son rôle
        const role = data.user.role;
        if (role === "Admin") {
          navigate("/welcome_admin", { state: { message: data.message } });
        } else if (role === "Modérateur") {
          navigate("/welcome", { state: { message: data.message } });
        } else {
          navigate("/welcome2", { state: { message: data.message } });
        }
      }
    } catch (error) {
      // Gestion des erreurs serveur
      setErrors((prev) => ({
        ...prev,
        global: "Erreur de connexion au serveur."
      }));
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="white-box">
      {/* Liens en haut pour login/signup */}
      <span className="login-link">Se connecter</span>
      <span
        className="signup-link"
        onClick={() => navigate("/signup")}
        style={{ cursor: "pointer", color: "#8997A7" }}
      >
        S'inscrire
      </span>

      {/* Affiche un message temporaire s'il existe */}
      {message && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#155724"
          }}
        >
          {message}
        </div>
      )}

      {/* Affiche une erreur globale s'il y en a une */}
      {errors.global && <p className="error-text">{errors.global}</p>}

      {/* Champ Email */}
      <div className={`eemail-container ${errors.email ? "error-border" : ""}`}>
        <div className="eemail-icon">
          <AiOutlineMail />
        </div>
        <div className="eemail-input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
        </div>
      </div>
      {errors.email && <p className="error-email">{errors.email}</p>}

      {/* Champ Mot de passe */}
      <div className={`password-container ${errors.mot_de_passe ? 'error-border' : ''}`}>
        <div className="password-icon">
          <AiOutlineLock />
        </div>
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => {
              setMotDePasse(e.target.value);
              setErrors(prev => ({ ...prev, mot_de_passe: "" }));
            }}
          />
        </div>
        {/* Icône pour afficher/masquer le mot de passe */}
        <div
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </div>
      </div>
      {errors.mot_de_passe && <p className="error-password">{errors.mot_de_passe}</p>}

      {/* Bouton pour se connecter */}
      <button className="navigation-button" onClick={handleLogin}>
        Se connecter
      </button>

      {/* Lien vers la page "mot de passe oublié" */}
      <span
        className="forgot-password"
        onClick={() => navigate("/forgotpass")}
        style={{ cursor: "pointer", color: "#19437A" }}
      >
        Mot de passe oublié ?
      </span>

      {/* Images décoratives à gauche et à droite */}
      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

      <div className="image-right">
        <img src="./public/login.jpg" alt="Illustration droite" />
      </div>
    </div>
  );
};

// Exportation du composant Login
export default Login;
