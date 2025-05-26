// Signup.jsx
import React, { useState } from "react";
import { AiOutlineMail, AiOutlineLock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import "./Global.css";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    id_role: ""
  });

  // Afficher / cacher mot de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // État des erreurs
  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
    confirmer_mot_de_passe: "",
    id_role: "",
    global: ""
  });

  // Met à jour form
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSignup = async () => {
    // 1)  global errors
    setErrors({ nom: "", prenom: "", email: "", mot_de_passe: "", confirmer_mot_de_passe: "", id_role: "", global: "" });

    // 2) Validation des champs 
    const newErrors = {};

    if (!form.nom) newErrors.nom = "Champ obligatoire.";
    if (!form.prenom) newErrors.prenom = "Champ obligatoire.";
    if (!form.email) {
      newErrors.email = "Champ obligatoire.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Format d'email invalide.";
    }

    if (!form.mot_de_passe) newErrors.mot_de_passe = "Champ obligatoire.";
    if (!form.confirmer_mot_de_passe) newErrors.confirmer_mot_de_passe = "Champ obligatoire.";
    if (
      form.mot_de_passe &&
      form.confirmer_mot_de_passe &&
      form.mot_de_passe !== form.confirmer_mot_de_passe
    ) {
      newErrors.confirmer_mot_de_passe = "Les mots de passe ne correspondent pas.";
    }
    if (!form.id_role) newErrors.id_role = "Champ obligatoire.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      return;
    }


    //  Envoi au backend
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          prenom: form.prenom,
          email: form.email,
          mot_de_passe: form.mot_de_passe,
          confirmer_mot_de_passe: form.confirmer_mot_de_passe,
          id_role:
            form.id_role === "admin" ? 1 :
              form.id_role === "generator" ? 2 :
                3
        })
      });
      const data = await response.json();
      if (response.ok) {
        setShowSuccessPopup(true);
        return;

      }

      if (!response.ok) {
        // Le backend peut renvoyer { field: "email", message: .....}
        if (data.field && Object.prototype.hasOwnProperty.call(errors, data.field)
        ) {
          setErrors(prev => ({ ...prev, [data.field]: data.message }));
        } else {
          setErrors(prev => ({ ...prev, global: data.message || "Erreur lors de la création." }));
        }
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, global: "Erreur de connexion au serveur." }));
      console.error(err);
    }
  };

  return (
    <div className="white-box">
      <span
        className="login1-link"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", color: "#8997A7" }}
      >
        Se connecter
      </span>
      <span className="signup1-link">S'inscrire</span>



      {/* Nom */}
      <div className={`nom-container ${errors.nom ? "error-border" : ""}`}>
        <div className="nom-input">
          <input
            name="nom"
            type="text"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
          />
        </div>
      </div>
      {errors.nom && <p className="error-nom">{errors.nom}</p>}

      {/* Prénom */}
      <div className={`prenom-container ${errors.prenom ? "error-border" : ""}`}>
        <div className="prenom-input">
          <input
            name="prenom"
            type="text"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
          />
        </div>
      </div>
      {errors.prenom && <p className="error-prenom">{errors.prenom}</p>}

      {/* Email */}
      <div className={`mail-container ${errors.email ? "error-border" : ""}`}>
        <div className="email-icon">
          <AiOutlineMail />
        </div>
        <div className="mail-input">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
      </div>
      {errors.email && <p className="error-mail">{errors.email}</p>}

      {/* Rôle */}
      <div className={`rolee-container ${errors.id_role ? "error-border" : ""}`}>
        <label htmlFor="role" className="role2-label">Rôle :</label>
        <select
          name="id_role"
          id="role"
          className="rolee-select"
          value={form.id_role}
          onChange={handleChange}
        >
          <option value="" disabled>Choisissez un rôle</option>
          <option value="admin">Administrateur</option>
          <option value="generator">Modérateur</option>
          <option value="visitor">Utilisateur</option>
        </select>
      </div>
      {errors.id_role && <p className="error-role">{errors.id_role}</p>}

      {/* Mot de passe */}
      <div className={`password1-container ${errors.mot_de_passe ? "error-border" : ""}`}>
        <div className="password-icon"><AiOutlineLock /></div>
        <div className="password1-input">
          <input
            name="mot_de_passe"
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={form.mot_de_passe}
            onChange={handleChange}
          />
        </div>
        <div className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </div>
      </div>
      {errors.mot_de_passe && <p className="error-mot_de_passe">{errors.mot_de_passe}</p>}

      {/* Confirmation mot de passe */}
      <div className={`passwordconfirm-container ${errors.confirmer_mot_de_passe ? "error-border" : ""}`}>
        <div className="password-icon"><AiOutlineLock /></div>
        <div className="passwordconfirm-input">
          <input
            name="confirmer_mot_de_passe"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmer mot de passe"
            value={form.confirmer_mot_de_passe}
            onChange={handleChange}
          />
        </div>
        <div className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </div>
      </div>
      {errors.confirmer_mot_de_passe && (
        <p className="error-confirmer_mot_de_passe">{errors.confirmer_mot_de_passe}</p>
      )}

      {/* Bouton S'inscrire */}
      <button className="navigation-button" onClick={handleSignup}>
        Créer compte
      </button>

      <div className="login-redirect">
        <span onClick={() => navigate("/")} // Redirection sans <Link>
          style={{ cursor: "pointer", color: "#0B3164" }} >J'ai déjà un compte ? </span>
      </div>

      {/* Images */}
      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />


      <div className="image-right">
        <img src="./public/login.jpg" alt="Illustration droite" />
      </div>
      {showSuccessPopup && (
        <div className="popup2-overlay">
          <div className="popup2-content">
            <p>Veuillez vérifier votre boîte mail et cliquer sur le lien pour activer votre compte.</p>
            <div className="popup2-buttons">
              <button className="btn-ok" onClick={() => {
                setShowSuccessPopup(false);
                navigate("/");
              }}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Signup;
