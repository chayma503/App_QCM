import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaPlusSquare, FaUserCircle, FaUserCog, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AjouterQCM.css";
import "./Global.css";

const AjouterQCM = ({ utilisateurId }) => {
    const [useCategorieExistante, setUseCategorieExistante] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategorieId, setSelectedCategorieId] = useState("");
    const [nouvelleCategorie, setNouvelleCategorie] = useState("");
    const [question, setQuestion] = useState("");
    const [reponses, setReponses] = useState([
        { reponse: "", status: false },
        { reponse: "", status: false },
        { reponse: "", status: false },
    ]);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [user, setUser] = useState(null);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const [newQuestionId, setNewQuestionId] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Charger les catégories dans tous les cas (pas seulement si useCategorieExistante)
        axios
            .get("http://localhost:5000/api/qcm/categories")
            .then((res) => {
                console.log("Catégories reçues :", res.data);
                setCategories(res.data);
            })
            .catch((err) =>
                console.error("Erreur de chargement des catégories", err)
            );
    }, []);


    const handleAddReponse = () => {
        setReponses([...reponses, { reponse: "", status: false }]);
    };

    const handleChangeReponse = (index, field, value) => {
        const updated = [...reponses];
        updated[index][field] = value;
        setReponses(updated);
    };

    const resetForm = () => {
        setSelectedCategorieId("");
        setNouvelleCategorie("");
        setQuestion("");
        setReponses([
            { reponse: "", status: false },
            { reponse: "", status: false },
            { reponse: "", status: false },
        ]);
        setErrors({});
    };

    const handleSubmit = async () => {
        setErrors({});
        setSuccessMessage("");

        const newErrors = {};

        // Validations générales
        if (
            (useCategorieExistante && !selectedCategorieId) ||
            (!useCategorieExistante && !nouvelleCategorie.trim())
        ) {
            newErrors.categorie = "Veuillez sélectionner ou saisir la catégorie.";
        }

        if (!question.trim()) {
            newErrors.question = "Veuillez saisir la question.";
        } else {
            if (reponses.length === 0 || reponses.every((r) => !r.reponse.trim())) {
                newErrors.reponses = "Veuillez ajouter au moins une réponse.";
            } else if (!reponses.some((r) => r.status === true)) {
                newErrors.reponseCorrecte = "Cochez au moins une réponse correcte.";
            }
        }

        // ✅ Vérification si la nouvelle catégorie existe déjà
        if (!useCategorieExistante && nouvelleCategorie.trim()) {
            const categorieExiste = categories.some(
                (cat) => cat.nom.trim().toLowerCase() === nouvelleCategorie.trim().toLowerCase()
            );
            if (categorieExiste) {
                newErrors.categorie = "Cette catégorie existe déjà. Veuillez la sélectionner dans la liste.";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const reponsesAvecUtilisateur = reponses
                .filter((r) => r.reponse.trim() !== "")
                .map((r) => ({
                    ...r,
                    id_utilisateur: utilisateurId,
                }));

            const payload = {
                categorie: useCategorieExistante ? selectedCategorieId : nouvelleCategorie,
                question,
                reponses: reponsesAvecUtilisateur,
                useCategorieExistante,
            };

            const response = await axios.post("http://localhost:5000/api/qcm/ajouter-qcm", payload);

            const { questionId } = response.data;
            setNewQuestionId(questionId);
            setShowSuccessPopup(true);
            resetForm();

        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);

            if (error.response && error.response.data?.error === "CATEGORIE_EXISTE") {
                setErrors({
                    categorie: "La catégorie existe déjà. Veuillez cocher 'Utiliser une catégorie existante'.",
                });
            } else {
                alert("Erreur lors de l'ajout du QCM.");
            }
        }
    };

    const toggleAccountInfo = () => {
        setShowAccountInfo(!showAccountInfo);
    };
    // Cette fonction permet de rediriger vers la page Consulter seulement après avoir cliqué sur le bouton
    const handleConsultClick = () => {
        setShowSuccessPopup(false);
        navigate("/ConsulterQuestion", {
            state: {
                categoryId: useCategorieExistante ? selectedCategorieId : nouvelleCategorie,
                questionId: newQuestionId,
                // Ajouter le nom de la catégorie si nécessaire
                categoryName: useCategorieExistante
                    ? categories.find(cat => cat.id === selectedCategorieId)?.nom
                    : nouvelleCategorie
            }
        });
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
        <div className="ajouter-container">
            <div className="back-arrow1" onClick={() => window.history.back()}>
                <FaArrowLeft />
            </div>

            <div className="white-box3">
                <div className="ajouter-qcm-content">
                    <div className="account-header">


                    </div>

                    <h1 className="ajouter-titre">Ajouter des questions</h1>
                    <div className="page-scroll">
                        {/* ... reste du formulaire ... */}
                        <div className="categorie-existante-section">
                            <input
                                type="checkbox"
                                className="custom-checkbox"

                                id="categorie-existante"
                                checked={useCategorieExistante}
                                onChange={() => setUseCategorieExistante(!useCategorieExistante)}
                            />
                            <label htmlFor="categorie-existante">
                                Utiliser une catégorie existante
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Ajouter le titre de catégorie:</label>
                            {useCategorieExistante ? (
                                <select
                                    className="select-categorie"
                                    value={selectedCategorieId}
                                    onChange={(e) => setSelectedCategorieId(e.target.value)}
                                >
                                    <option value="" disabled hidden>Sélectionner une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nom}
                                        </option>
                                    ))}
                                </select>

                            ) : (
                                <input
                                    type="text"
                                    className="input-texte"
                                    value={nouvelleCategorie}
                                    onChange={(e) => setNouvelleCategorie(e.target.value)}
                                />
                            )}
                            {errors.categorie && (
                                <p className="erreur-message">{errors.categorie}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Entrer la question:</label>
                            <input
                                type="text"
                                className="input-texte"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                            />
                            {errors.question && (
                                <p className="erreur-message">{errors.question}</p>
                            )}
                        </div>

                        <p className="instruction">Cochez les réponses correctes</p>

                        <div className="form-group">
                            <label className="res">Les réponses:</label>
                            {reponses.map((rep, index) => (
                                <div key={index} className="reponse-ligne">
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"

                                        checked={rep.status}
                                        onChange={(e) =>
                                            handleChangeReponse(index, "status", e.target.checked)
                                        }
                                    />
                                    <input
                                        type="text"
                                        className="input-reponse"
                                        value={rep.reponse}
                                        onChange={(e) =>
                                            handleChangeReponse(index, "reponse", e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                            {errors.reponses && (
                                <p className="erreur-message">{errors.reponses}</p>
                            )}
                            {errors.reponseCorrecte && (
                                <p className="erreur-message">{errors.reponseCorrecte}</p>
                            )}
                        </div>

                        <p className="ajouter-plus" onClick={handleAddReponse}>
                            + Plus de réponses
                        </p>

                        <button className="ajouter-button" onClick={handleSubmit}>
                            <FaPlusSquare style={{ marginRight: "8px" }} />
                            Ajouter
                        </button>

                        {successMessage && (
                            <p className="success-message">{successMessage}</p>
                        )}
                    </div>
                </div>
            </div>
            {user ? (
                <div className="account-initial-circle1" onClick={toggleAccountInfo} title={user.email}>
                    {getInitials()}
                </div>
            ) : null}

            {/* Informations du compte */}
            {showAccountInfo && user && (
                <div className="account-info111">
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

            {/* Popup de confirmation */}
            {showSuccessPopup && (
                <div className="popup-overlay1">
                    <div className="popup-content1">
                        <h2>Question ajouté avec succès !</h2>
                        <div className="popup-buttons1">
                            <button
                                className="popup-btn1"
                                onClick={() => setShowSuccessPopup(false)} // Ferme la popup
                            >
                                Ajouter une autre question
                            </button>
                            <button
                                className="popup-btn1"
                                onClick={handleConsultClick} // Redirige vers la page de consultation
                            >
                                Consulter les questions
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

        </div>
    );
};

export default AjouterQCM;
