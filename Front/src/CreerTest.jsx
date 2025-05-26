import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    FaArrowLeft,
    FaUserCircle,
    FaPen,
    FaUserCog,
    FaSignOutAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./CreerTest.css";
import "./Global.css";

const CreerTest = () => {
    const [titre, setTitre] = useState('');
    const [timeLimit, setTimeLimit] = useState('');
    const [status, setStatus] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [user, setUser] = useState(null);
    const [idUtilisateur, setIdUtilisateur] = useState(null);
    const [errors, setErrors] = useState({
        titre: '',
        timeLimit: '',
        status: '',
        questions: ''
    });

    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const handlePopupOk = () => {
        setShowPopup(false);
        navigate("/ConsulterTest"); // redirection
    };

    useEffect(() => {
        const savedQuestions = localStorage.getItem("selectedQuestions");
        if (savedQuestions) {
            setSelectedQuestions(JSON.parse(savedQuestions));
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIdUtilisateur(parsedUser.id);
        }
    }, []);

    const mapStatusToEnglish = {
        "disponible": "available",
        "désactivé": "deactivated",
        "masqué": "hidden"
    };

    const validateForm = () => {
        let formErrors = {
            titre: '',
            timeLimit: '',
            status: '',
            questions: ''
        };

        if (!titre) formErrors.titre = "Le titre est requis.";
        if (!timeLimit) formErrors.timeLimit = "Le temps limite est requis.";
        if (!status) formErrors.status = "Le statut du test est requis.";
        if (selectedQuestions.length === 0) formErrors.questions = "Vous devez sélectionner au moins une question.";

        setErrors(formErrors);
        return Object.values(formErrors).every(error => !error);
    };

    const handleGenerateTest = async () => {
        if (!validateForm()) return;

        const statutAnglais = mapStatusToEnglish[status];

        const questionsPayload = selectedQuestions.map(q => ({
            id: q.id,
            intitule: q.question,
            reponses: q.reponses || []
        }));

        try {
            const res = await axios.post("http://localhost:5000/api/tests/generate-test", {
                titre,
                time_limit: parseInt(timeLimit),
                statut: statutAnglais,
                nb_question_max: selectedQuestions.length,
                id_utilisateur: idUtilisateur,
                questions: questionsPayload
            });

            const downloadUrl = `http://localhost:5000${res.data.downloadUrl}`;
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.setAttribute("download", "test.php");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            localStorage.setItem("lastCreatedTestId", res.data.testId); // Assure-toi que le backend renvoie l'ID du test

            setShowPopup(true); // afficher la popup après le téléchargement


        } catch (err) {
            console.error("Erreur :", err);
            alert("Erreur lors de la génération du test");
        }

    };

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
        <div className="white-box12">
            <div className="header">
                <div className="back-arrow" onClick={() => window.history.back()}>
                    <FaArrowLeft />
                </div>
                <h2 className="titre-creation">Créer un Test</h2>

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
            </div>

            <div className="form-section">
                <div className="form-row">
                    <label className="label-champ">
                        <span className="bullet">⊚</span> Donner le titre du Test:
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={titre}
                        onChange={e => setTitre(e.target.value)}
                    />
                    {errors.titre && <p className="error-message">{errors.titre}</p>}
                </div>

                <div className="form-row">
                    <label className="label-champ">
                        <span className="bullet">⊚</span> Donner le temps limite:
                    </label>
                    <input
                        type="number"
                        className="input-field"
                        value={timeLimit}
                        onChange={e => setTimeLimit(e.target.value)}
                    />
                    {errors.timeLimit && <p className="error-message">{errors.timeLimit}</p>}
                </div>

                <div className="form-row1">
                    <label className="label-champ">
                        <span className="bullet">⊚</span> Choisir le statut du Test:
                    </label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="status"
                                value="disponible"
                                checked={status === "disponible"}
                                onChange={() => setStatus("disponible")}
                            />
                            Disponible
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="status"
                                value="désactivé"
                                checked={status === "désactivé"}
                                onChange={() => setStatus("désactivé")}
                            />
                            Désactivé
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                name="status"
                                value="masqué"
                                checked={status === "masqué"}
                                onChange={() => setStatus("masqué")}
                            />
                            Masqué
                        </label>
                    </div>
                    {errors.status && <p className="error-message1">{errors.status}</p>}
                </div>

                {errors.questions && <p className="error-message1">{errors.questions}</p>}

                <button className="generate-button" onClick={handleGenerateTest}>
                    <FaPen className="icon" /> Générer le test
                </button>
            </div>

            <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

            {showPopup && (
                <div className="popup2-overlay">
                    <div className="popup2-content">
                        <p>Test généré et fichier téléchargé !</p>
                        <div className="popup2-buttons">
                            <button className="btn-ok" onClick={() => handlePopupOk(false)}>OK</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CreerTest;