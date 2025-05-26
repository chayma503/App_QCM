import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaArrowLeft,
    FaUserCircle,
    FaUserCog,
    FaSignOutAlt
} from "react-icons/fa";
import axios from 'axios';
import "./ConsulterTest.css";
import { FaSearch } from "react-icons/fa";
const ConsulterTest = () => {
    const [tests, setTests] = useState([]);
    const [selectedTestId, setSelectedTestId] = useState(null);
    const [categoriesByTest, setCategoriesByTest] = useState({});
    const [questionsByCategory, setQuestionsByCategory] = useState({});
    const [questionResponses, setQuestionResponses] = useState({});
    const [user, setUser] = useState(null);
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();



    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        axios.get(`http://localhost:5000/api/tests/tests`)
            .then(res => {
                setTests(res.data);

                const lastCreatedTestId = localStorage.getItem("lastCreatedTestId");
                if (lastCreatedTestId) {
                    handleTestSelect(parseInt(lastCreatedTestId)); // Auto-sélection
                    localStorage.removeItem("lastCreatedTestId"); // Nettoyage
                }
            })
            .catch(err => console.error("Erreur récupération tests :", err));
    }, []);

    const toggleAccountInfo = () => setShowAccountInfo(!showAccountInfo);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/", { state: { message: "Déconnexion réussie" } });
    };

    const handleTestSelect = async (testId) => {
        setSelectedTestId(testId);

        if (!categoriesByTest[testId]) {
            try {
                const catRes = await axios.get(`http://localhost:5000/api/tests/tests/${testId}/categories`);
                setCategoriesByTest(prev => ({ ...prev, [testId]: catRes.data }));

                // Charger toutes les questions et réponses de chaque catégorie
                for (const cat of catRes.data) {
                    const qRes = await axios.get(`http://localhost:5000/api/questions/by-category/${cat.id}`);
                    setQuestionsByCategory(prev => ({ ...prev, [cat.id]: qRes.data }));

                    for (const q of qRes.data) {
                        const repRes = await axios.get(`http://localhost:5000/api/reponses/by-question/${q.id}`);
                        setQuestionResponses(prev => ({ ...prev, [q.id]: repRes.data }));
                    }
                }

            } catch (err) {
                console.error("Erreur chargement test :", err);
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
                <span className="titre-liste-questions">Contenu du test</span>

                <div className="categorie-question-scroll1">
                    {selectedTestId === null ? (
                        <p>Aucun test sélectionné.</p>
                    ) : (
                        (categoriesByTest[selectedTestId] || []).map(cat => {
                            const questions = questionsByCategory[cat.id] || [];
                            return (
                                <div key={cat.id} className="categorie-contenu">
                                    <h3 className="categorie-titre">Catégorie : {cat.nom}</h3>
                                    {questions.length > 0 ? (
                                        questions.map((q, qIndex) => {
                                            // 👉 AJOUT ICI
                                            console.log(`Réponses pour la question ${q.id}:`, questionResponses[q.id]);
                                            questionResponses[q.id]?.forEach(rep => {
                                                console.log(`→ ${rep.reponse} | est_correcte: ${rep.est_correcte}`);
                                            });

                                            return (
                                                <div key={q.id} className="question-bloc2">
                                                    <p className="question-numero2">Question n°{qIndex + 1}:</p>
                                                    <p className="question-texte2">» {q.question}</p>
                                                    <ul className="liste-reponses2">
                                                        {(questionResponses[q.id] || []).map((rep, index) => (
                                                            <li
                                                                key={index}
                                                                className={`reponse-item2 ${rep.status ? 'correct' : 'incorrect'}`}
                                                            >
                                                                <span>
                                                                    {rep.reponse}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p>Aucune question dans cette catégorie.</p>
                                    )}

                                </div>
                            );
                        })
                    )}
                </div>
            </div>

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
                        placeholder="Rechercher un test..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-bar-input"
                    />
                    <FaSearch className="search-icon" />
                </div>

                <span className="titre-liste-des-categories">Liste des tests</span>

                <div className="categorie-scroll11">
                    {tests.length === 0 ? (
                        <p>Aucun test trouvé.</p>
                    ) : (
                        tests
                            .filter((test) =>
                                test.titre.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(test => (
                                <div key={test.id} className="categorie-item1">
                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            name="test"
                                            onChange={() => handleTestSelect(test.id)}
                                            checked={selectedTestId === test.id}
                                            style={{ marginRight: '8px' }}
                                        />
                                        <span className="category-name1">{test.titre}</span>
                                    </label>
                                </div>
                            ))
                    )}

                </div>

                {/* Image décorative en bas à gauche */}
                <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />


            </div>

        </div>

    );

};

export default ConsulterTest;
