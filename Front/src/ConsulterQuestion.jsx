import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    FaArrowLeft, FaUserCircle, FaUserCog, FaSignOutAlt,
    FaEdit, FaTrash, FaPlus, FaCheck, FaTimes
} from "react-icons/fa";
import axios from 'axios';
import "./ConsulterQuestion.css";
import { FaSearch } from "react-icons/fa";
const ConsulterQuestion = () => {
    const [categories, setCategories] = useState([]);
    const [openCategoryId, setOpenCategoryId] = useState(null);
    const [questionsByCategory, setQuestionsByCategory] = useState({});
    const [questionResponses, setQuestionResponses] = useState({});
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editedQuestion, setEditedQuestion] = useState('');
    const [editedResponses, setEditedResponses] = useState([]);
    const [user, setUser] = useState(null);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();  // Utilisation de useLocation pour récupérer les paramètres

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        axios.get(`http://localhost:5000/api/categories/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur récupération catégories :", err));

        const { categoryId, questionId } = location.state || {};
        if (categoryId) {
            setOpenCategoryId(categoryId);
            handleCategoryRadio(categoryId); // Charge les questions de la catégorie
        }

        if (questionId) {
            // On récupère le libellé de la question
            axios.get(`http://localhost:5000/api/questions/${questionId}`)
                .then((questionRes) => {
                    const questionText = questionRes.data.question;

                    axios.get(`http://localhost:5000/api/reponses/by-question/${questionId}`)
                        .then((repRes) => {
                            const reponses = repRes.data;

                            setQuestionsByCategory((prev) => {
                                const updated = { ...prev };

                                if (!updated[categoryId]) {
                                    updated[categoryId] = [];
                                }

                                const alreadyExists = updated[categoryId].some(q => q.id === questionId);
                                if (!alreadyExists) {
                                    updated[categoryId].push({
                                        id: questionId,
                                        question: questionText,
                                        reponses: reponses,
                                    });
                                }

                                return updated;
                            });

                            setQuestionResponses(prev => ({
                                ...prev,
                                [questionId]: { reponses },
                            }));
                        });
                })
                .catch((err) => console.error("Erreur récupération question/réponses :", err));
        }
    }, [location.state]);
    // Recharger uniquement à chaque changement de location (pas sur questionsByCategory)

    const toggleAccountInfo = () => setShowAccountInfo(!showAccountInfo);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/", { state: { message: "Déconnexion réussie" } });
    };

    const handleCategoryRadio = async (categoryId) => {
        setOpenCategoryId(categoryId);

        if (!questionsByCategory[categoryId]) {
            try {
                const res = await axios.get(`http://localhost:5000/api/questions/by-category/${categoryId}`);
                setQuestionsByCategory(prev => ({ ...prev, [categoryId]: res.data }));

                // Charger les réponses pour chaque question
                const newResponses = {};
                for (const question of res.data) {
                    const repRes = await axios.get(`http://localhost:5000/api/reponses/by-question/${question.id}`);
                    newResponses[question.id] = { reponses: repRes.data };
                }
                setQuestionResponses(prev => ({ ...prev, ...newResponses }));
            } catch (err) {
                console.error("Erreur chargement questions/réponses :", err);
                alert("Erreur lors du chargement des questions et réponses.");
            }
        }
    };

    const startEdit = (q) => {
        setEditingQuestionId(q.id);
        setEditedQuestion(q.question);
        const reps = questionResponses[q.id]?.reponses || [];
        setEditedResponses(reps.map(r => ({ ...r })));
    };

    const cancelEdit = () => {
        setEditingQuestionId(null);
        setEditedQuestion('');
        setEditedResponses([]);
    };

    const updateResponseText = (index, newValue) => {
        const updated = [...editedResponses];
        updated[index].reponse = newValue;
        setEditedResponses(updated);
    };

    const updateResponseStatus = (index) => {
        const updated = [...editedResponses];
        updated[index].status = !updated[index].status;
        setEditedResponses(updated);
    };

    const addNewResponse = () => {
        setEditedResponses([...editedResponses, { reponse: '', status: false }]);
    };

    const removeResponse = (index) => {
        const updated = [...editedResponses];
        updated.splice(index, 1);
        setEditedResponses(updated);
    };

    const saveEdit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/questions/${editingQuestionId}`, {
                question: editedQuestion
            });

            // 1. Supprimer toutes les anciennes réponses de cette question
            await axios.delete(`http://localhost:5000/api/reponses/by-question/${editingQuestionId}`);

            // 2. Ajouter les réponses actuelles (editedResponses)
            // Remplace cette partie :
            for (const rep of editedResponses) {
                await axios.post(`http://localhost:5000/api/reponses`, {
                    reponse: rep.reponse,
                    status: rep.status,
                    id_question: editingQuestionId,
                    id_utilisateur: user.id
                });
            }


            // 3. Mettre à jour l'état local (React)
            setQuestionsByCategory(prev => {
                const updatedQuestions = prev[openCategoryId].map(q =>
                    q.id === editingQuestionId ? { ...q, question: editedQuestion } : q
                );
                return { ...prev, [openCategoryId]: updatedQuestions };
            });

            setQuestionResponses(prev => ({
                ...prev,
                [editingQuestionId]: { reponses: editedResponses }
            }));

            cancelEdit();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error.response?.data || error.message);
            alert("Erreur de sauvegarde : " + (error.response?.data?.message || error.message));
        }
    };

    const deleteQuestion = async () => {
        if (!questionToDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/questions/${questionToDelete}`);

            const res = await axios.get(`http://localhost:5000/api/questions/by-category/${openCategoryId}`);
            setQuestionsByCategory(prev => ({ ...prev, [openCategoryId]: res.data }));

            const newResponses = {};
            for (const q of res.data) {
                const repRes = await axios.get(`http://localhost:5000/api/reponses/by-question/${q.id}`);
                newResponses[q.id] = { reponses: repRes.data };
            }
            setQuestionResponses(prev => ({ ...prev, ...newResponses }));
        } catch (err) {
            console.error("Erreur lors de la suppression :", err);
            alert("La suppression a échoué.");
        } finally {
            setShowPopup(false);
            setQuestionToDelete(null);
        }
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
        <div className="global-box1">
            <div className="white-box11">
                <span className="titre-liste-questions">Liste des questions</span>
                <div className="categorie-question-scroll1">
                    {openCategoryId === null ? (
                        <p>Aucune catégorie sélectionnée.</p>
                    ) : (
                        categories.filter(cat => cat.id === openCategoryId).map(cat => {
                            const questions = questionsByCategory[cat.id] || [];
                            return (
                                <div key={cat.id} className="categorie-contenu">
                                    <h3 className="categorie-titre">Catégorie : {cat.nom}</h3>
                                    {questions.length > 0 ? (
                                        questions.map((q, qIndex) => (
                                            <div key={q.id} className="question-bloc3">
                                                <div className="question-header1">
                                                    <p className="question-numero">Question n°{qIndex + 1}:</p>
                                                    <div className="question-actions">
                                                        <button className="edit-btn" onClick={() => startEdit(q)}><FaEdit /></button>
                                                        <button className="delete-btn" onClick={() => {
                                                            setQuestionToDelete(q.id);
                                                            setShowPopup(true);
                                                        }}><FaTrash /></button>
                                                    </div>
                                                </div>

                                                {editingQuestionId === q.id ? (
                                                    <div className="edit-zone">
                                                        <textarea
                                                            className="edit-question-input"
                                                            value={editedQuestion}
                                                            onChange={(e) => setEditedQuestion(e.target.value)}
                                                        />
                                                        <ul className="edit-reponses-liste">
                                                            {editedResponses.map((r, i) => (
                                                                <li key={i} className="edit-reponse-item">
                                                                    <input
                                                                        type="text"
                                                                        value={r.reponse}
                                                                        onChange={(e) => updateResponseText(i, e.target.value)}
                                                                        placeholder={`Réponse ${i + 1}`}
                                                                    />
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={r.status}
                                                                        onChange={() => updateResponseStatus(i)}
                                                                    />
                                                                    <button onClick={() => removeResponse(i)} className="delete-response-button">✖</button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <button onClick={addNewResponse}><FaPlus /> Ajouter une réponse</button>
                                                        <div className="edit-buttons">
                                                            <button onClick={saveEdit}><FaCheck /> Valider</button>
                                                            <button onClick={cancelEdit}><FaTimes /> Annuler</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="question-texte">» {q.question}</p>
                                                        {questionResponses[q.id]?.reponses ? (
                                                            <ul className="liste-reponses3">
                                                                {questionResponses[q.id].reponses.map((r, index) => (
                                                                    <li
                                                                        key={index}
                                                                        className={`reponse-item3 ${r.status ? 'correct' : 'incorrect'}`}
                                                                    >
                                                                        {r.reponse}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : <p>Chargement des réponses...</p>}
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>Aucune question dans cette catégorie.</p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Avatar avec initiale */}
            {
                user ? (
                    <div className="account-initial-circle" onClick={toggleAccountInfo} title={user.email}>
                        {getInitials()}
                    </div>
                ) : null
            }
            {
                showAccountInfo && user && (
                    <div className="account-info">
                        <p>Nom : {user.nom}</p>
                        <p>Email : {user.email}</p>
                        <button className="account-button" onClick={() => navigate("/manage-account")}><FaUserCog /> Gérer votre compte</button>
                        <button className="account-button" onClick={handleLogout}><FaSignOutAlt /> Déconnecter</button>
                    </div>
                )
            }

            <div className="grey-box1">
                <div className="back-arrow" onClick={() => window.history.back()}><FaArrowLeft /></div>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar-input"
                    />
                    <FaSearch className="search-icon" />

                </div>
                <span className="titre-liste-des-categories">Liste des catégories</span>

                <div className="categorie-scroll11">
                    {categories.length === 0 ? (
                        <p>Aucune catégorie trouvée.</p>
                    ) : (
                        categories
                            .filter((cat) => cat.nom.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((cat) => (
                                <div key={cat.id} className="categorie-item1">
                                    <label>
                                        <input
                                            type="radio"
                                            name="category"
                                            onChange={() => handleCategoryRadio(cat.id)}
                                            checked={openCategoryId === cat.id}
                                            style={{ marginRight: '8px' }}
                                        />
                                        <span className="category-name1">{cat.nom}</span>
                                    </label>
                                </div>
                            )))}
                </div>
                <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />
            </div>

            {/* ✅ POPUP MODAL DE CONFIRMATION */}
            {
                showPopup && (
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <p>Voulez-vous vraiment supprimer cette question ?</p>
                            <div className="popup-buttons">
                                <button onClick={deleteQuestion}><FaCheck /> Oui</button>
                                <button onClick={() => { setShowPopup(false); setQuestionToDelete(null); }}><FaTimes /> Non</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ConsulterQuestion;