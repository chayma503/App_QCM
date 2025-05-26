import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaUserCircle,
    FaUserCog,
    FaSignOutAlt
} from "react-icons/fa";
import axios from 'axios';
import "./ConsulterUtilisateur.css";
import { FaSearch } from "react-icons/fa";
const ConsulterUtilisateur = () => {
    const [categories, setCategories] = useState([]);
    const [openCategoryId, setOpenCategoryId] = useState(null); // Un seul ID de catégorie à la fois
    const [questionsByCategory, setQuestionsByCategory] = useState({});
    const [questionResponses, setQuestionResponses] = useState({});
    const [user, setUser] = useState(null);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        axios.get(`http://localhost:5000/api/categories/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur récupération catégories :", err));
    }, []);

    const toggleAccountInfo = () => {
        setShowAccountInfo(!showAccountInfo);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/", { state: { message: "Déconnexion réussie" } });
    };

    const handleCategoryRadio = async (categoryId) => {
        setOpenCategoryId(categoryId); // Une seule catégorie à la fois

        if (!questionsByCategory[categoryId]) {
            try {
                const res = await axios.get(`http://localhost:5000/api/questions/by-category/${categoryId}`);
                setQuestionsByCategory(prev => ({ ...prev, [categoryId]: res.data }));

                // Charger les réponses de chaque question
                for (const question of res.data) {
                    const repRes = await axios.get(`http://localhost:5000/api/reponses/by-question/${question.id}`);
                    setQuestionResponses(prev => ({ ...prev, [question.id]: repRes.data }));
                }
            } catch (err) {
                console.error("Erreur chargement questions/réponses :", err);
            }
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
            {/* BOÎTE BLANCHE */}
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
                                                <p className="question-numero">Question n°{qIndex + 1}:</p>
                                                <p className="question-texte1">» {q.question}</p>
                                                <ul className="liste-reponses3">
                                                    {(questionResponses[q.id] || []).map((rep, index) => (
                                                        <li
                                                            key={index}
                                                            className={`reponse-item3 ${rep.status ? "correct" : "incorrect"}`}
                                                        >
                                                            {" " + rep.reponse}
                                                        </li>
                                                    ))}
                                                </ul>

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

            {/* Infos compte */}
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
            {/* BOÎTE GRISE */}
            <div className="grey-box1">
                <div className="back-arrow" onClick={() => window.history.back()}>
                    <FaArrowLeft />
                </div>
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
                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            name="category"  // Tous les radio boutons ont le même nom pour être mutuellement exclusifs
                                            onChange={() => handleCategoryRadio(cat.id)}
                                            checked={openCategoryId === cat.id}  // Seulement une catégorie peut être sélectionnée à la fois
                                            style={{ marginRight: '8px' }}
                                        />
                                        <span className="category-name1">{cat.nom}</span>
                                    </label>
                                </div>
                            ))
                    )}
                </div>

                <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

            </div>
        </div>
    );
};

export default ConsulterUtilisateur;