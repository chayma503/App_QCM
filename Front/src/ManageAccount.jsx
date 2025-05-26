import React, { useEffect, useState } from 'react';
import { AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import './ManageAccount.css';
import './Global.css';
import {
  FaArrowLeft, FaRegEdit,
  FaPlusSquare,
  FaEye,
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa";
const ManageAccount = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // 👈 nouveau state
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isModified, setIsModified] = useState(false);

  const [userData, setUserData] = useState({
    nom: '',
    prenom: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      fetch(`http://localhost:5000/api/users/user/${storedUser.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData({
            nom: data.nom,
            prenom: data.prenom,
            email: data.email,
            role: data.role,
          });
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données utilisateur:", error);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => {
      const updatedData = { ...prev, [name]: value };
      checkIfModified(updatedData, currentPassword, newPassword, confirmNewPassword);
      return updatedData;
    });
  };
  const checkIfModified = (updatedUserData, currentPwd, newPwd, confirmPwd) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const nameChanged = updatedUserData.nom !== userData.nom || updatedUserData.prenom !== userData.prenom;
    const passwordChanged = currentPwd || newPwd || confirmPwd;

    setIsModified(nameChanged || passwordChanged);
  };

  useEffect(() => {
    checkIfModified(userData, currentPassword, newPassword, confirmNewPassword);
  }, [currentPassword, newPassword, confirmNewPassword]);

  const handleUpdateName = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      alert("Utilisateur non connecté");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/update-name/${storedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: userData.nom,
          prenom: userData.prenom
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage("Compte mis à jour avec succès !");
        setShowUpdatePopup(true);
      } else {
        setUpdateMessage(data.message || "Erreur lors de la mise à jour.");
        setShowUpdatePopup(true);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la requête.");
    }
  };


  const handleUpdateAccount = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      alert("Utilisateur non connecté");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setUpdateMessage("Le nouveau mot de passe ne correspond pas à la confirmation.");
      setShowUpdatePopup(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/update-account/${storedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom: userData.nom,
          prenom: userData.prenom,
          oldPassword: currentPassword,
          newPassword: newPassword,
          confirmPassword: confirmNewPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage("Compte mis à jour avec succès !");
        setShowUpdatePopup(true);
      } else {
        setUpdateMessage(data.message || "Erreur lors de la mise à jour.");
        setShowUpdatePopup(true);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la requête.");
    }
  };



  return (
    <div className="gerer-white-box">
      <div className="back-arrow" onClick={() => window.history.back()}>
        <FaArrowLeft />
      </div>
      <span className="gerer-votreCompte">Gérer votre compte</span>

      <div className="gerer-scroll">
        {/* Nom */}
        <div className="nom2-container">
          <div className="nom2-input">
            <input name="nom" type="text" value={userData.nom} onChange={handleChange} />
          </div>
          <p className="nom-label">Nom</p>
        </div>

        {/* Prénom */}
        <div className="prenom2-container">
          <div className="prenom2-input">
            <input name="prenom" type="text" value={userData.prenom} onChange={handleChange} />
          </div>
          <p className="prenom-label">Prénom</p>
        </div>

        {/* Email */}
        <div className="mail2-container">
          <div className="mail2-icon"><AiOutlineMail /></div>
          <div className="mail2-input">
            <input name="email" type="email" value={userData.email} readOnly />
          </div>
          <p className="email-label">Email</p>
        </div>

        {/* Rôle */}
        <div className="role2-container">
          <div className="role2-input">
            <input name="role" type="text" value={userData.role} readOnly />
          </div>
          <p className="role-label">Rôle</p>
        </div>

        {/* ✅ Lien pour afficher les champs mot de passe */}
        <span className="modifier-password"
          onClick={() => setShowPasswordFields(!showPasswordFields)}
        >
          Modifier votre mot de passe ?
        </span>

        {/* Champs de mot de passe conditionnels */}
        {showPasswordFields && (
          <>
            <div className="password2-container">
              <div className="password2-icon"><AiOutlineLock /></div>
              <div className="password2-input">
                <input name="mot_de_passe" type="text" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <p className="password-label">Mot de passe actuel</p>
            </div>

            <div className="new-password-container">
              <div className="password2-icon"><AiOutlineLock /></div>
              <div className="new-password-input">
                <input name="new_mot_de_passe" type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <p className="password-label">Nouveau mot de passe</p>
            </div>

            <div className="confirmer-new-password-container">
              <div className="password2-icon"><AiOutlineLock /></div>
              <div className="confirmer-new-password-input">
                <input name="confirm_new_mot_de_passe" type="text" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
              </div>
              <p className="password-label">Confirmer nouveau mot de passe</p>
            </div>
          </>
        )}
      </div>

      {/* ✅ Le bouton reste toujours affiché */}
      <button
        className="modifier-button"
        onClick={showPasswordFields ? handleUpdateAccount : handleUpdateName}
        disabled={!isModified}
      >
        Modifier
      </button>



      {/* Image */}
      <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />


      {showUpdatePopup && (
        <div className="popup2-overlay">
          <div className="popup2-content">
            <p>{updateMessage}</p>
            <div className="popup2-buttons">
              <button className="btn-ok" onClick={() => {
                setShowUpdatePopup(false);
                window.history.back();
              }}>OK</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageAccount;
