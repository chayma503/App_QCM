import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaUserCircle,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import axios from 'axios';
import "./Creer_test.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const Creer_test = () => {
  const [categories, setCategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [questionsByCategory, setQuestionsByCategory] = useState({});
  const [selectedQuestions, setSelectedQuestions] = useState({});
  const [questionResponses, setQuestionResponses] = useState({});
  const [tests, setTests] = useState([]);
  const [showTests, setShowTests] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [showAccountInfo, setShowAccountInfo] = useState(false);
  const [showNoQuestionPopup, setShowNoQuestionPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios.get('http://localhost:5000/api/categories/categories')
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

  const toggleCategory = async (categoryId) => {
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
    } else {
      setOpenCategoryId(categoryId);
      if (!questionsByCategory[categoryId]) {
        try {
          const res = await axios.get(`http://localhost:5000/api/questions/by-category/${categoryId}`);
          setQuestionsByCategory(prev => ({
            ...prev,
            [categoryId]: res.data
          }));
        } catch (err) {
          console.error("Erreur récupération questions :", err);
        }
      }
    }
  };

  const handleQuestionToggle = (categoryId, question) => {
    setSelectedQuestions(prev => {
      const catQuestions = prev[categoryId] || [];
      const isAlreadySelected = catQuestions.some(q => q.id === question.id);

      if (isAlreadySelected) {
        const updated = catQuestions.filter(q => q.id !== question.id);
        return { ...prev, [categoryId]: updated };
      } else {
        return { ...prev, [categoryId]: [...catQuestions, question] };
      }
    });

    axios.get(`http://localhost:5000/api/reponses/by-question/${question.id}`)
      .then(res => {
        setQuestionResponses(prev => ({
          ...prev,
          [question.id]: {
            question: question.question,
            reponses: res.data
          }
        }));
      })
      .catch(err => console.error("Erreur récupération réponses :", err));
  };

  const handleSuivantClick = () => {
    const isAnyQuestionSelected = Object.values(selectedQuestions).some(
      questions => questions.length > 0
    );

    if (!isAnyQuestionSelected) {
      setShowNoQuestionPopup(true); // Afficher la popup
      return;
    }

    localStorage.setItem("selectedQuestions", JSON.stringify(
      Object.values(selectedQuestions).flat().map(q => ({
        id: q.id,
        question: q.question,
        reponses: questionResponses[q.id]?.reponses || []
      }))
    ));

    navigate("/Creertest");
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tests/tests');
      setTests(res.data);
      setShowTests(true);
    } catch (error) {
      console.error("Erreur lors de l'import des tests :", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTests(false);
      }
    };

    if (showTests) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTests]);

  const handleTestSelect = async (testId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tests/full/${testId}`);
      const data = res.data;

      let newSelectedQuestions = {};
      let newResponses = {};

      data.forEach(category => {
        newSelectedQuestions[category.id] = category.questions.map(q => ({
          id: q.id,
          question: q.question
        }));

        category.questions.forEach(q => {
          newResponses[q.id] = {
            question: q.question,
            reponses: q.reponses
          };
        });
      });

      setSelectedQuestions(newSelectedQuestions);
      setQuestionResponses(newResponses);
      setShowTests(false); // cacher le menu déroulant
    } catch (err) {
      console.error("Erreur lors du chargement du test :", err);
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
    <div className="global-box">
      <div className="white-box1">
        <span className="titre-creer-test">Test</span>

        <div className="categorie-scroll2">
          <div className="selected-questions-panel">
            <div className="categorie-question-scroll">
              {Object.entries(selectedQuestions).map(([catId, questions]) => {
                if (!questions.length) return null;
                const category = categories.find(c => c.id == catId);

                return (
                  <div key={catId} className="selected-category">
                    <h3 className="selected-category-title">
                      {category?.nom || `Catégorie ${catId}`}
                    </h3>
                    <ul>
                      {questions.map((q) => (
                        <li key={q.id} className="selected-question-item">
                          {q.question}

                          {questionResponses[q.id] && (
                            <div className="question-detail">
                              <ul className="reponses-liste">
                                {questionResponses[q.id].reponses.map((r, index) => (
                                  <li
                                    key={index}
                                    className={`reponse-item ${r.status ? 'correct' : 'incorrect'}`}
                                  >
                                    {r.reponse}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}

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
          </div>
        </div>

        <button className="suivant-button" onClick={handleSuivantClick}>
          Suivant
        </button>

        <button className="import-button" onClick={fetchTests}>
          <FiDownload className="icon" />
          Importer un Test
        </button>

        {showTests && (
          <div ref={dropdownRef} className="dropdown-tests">
            {tests.map((test) => (
              <div
                key={test.id}
                className="dropdown-item"
                onClick={() => handleTestSelect(test.id)}
              >
                {test.titre}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grey-box">
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
        <span className="categories">Les catégories</span>

        <div className="categorie-scroll0">
          {categories.length === 0 ? (
            <p>Aucune catégorie trouvée.</p>
          ) : (
            categories
              .filter((cat) => cat.nom.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((cat) => (
                <div key={cat.id} className="categorie-item">
                  <div
                    className="categorie-header"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <span className="arrow">
                      {openCategoryId === cat.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                    </span>
                    <span className="category-name">{cat.nom}</span>
                  </div>

                  {openCategoryId === cat.id && (
                    <>
                      {questionsByCategory[cat.id]?.length > 0 ? (
                        <ul className="question-list">
                          {questionsByCategory[cat.id].map((q) => (
                            <li
                              key={q.id}
                              className="question-item"
                              style={{ display: 'flex', alignItems: 'start' }}
                            >
                              <input
                                type="checkbox"
                                className="custom-checkbox"

                                checked={selectedQuestions[cat.id]?.some(sel => sel.id === q.id) || false}
                                onChange={() => handleQuestionToggle(cat.id, q)}
                                style={{ marginRight: '8px' }}
                              />
                              {q.question}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="aucune-question">Aucune question disponible.</p>
                      )}
                    </>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Image décorative en bas à gauche */}
        <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

      </div>
      {showNoQuestionPopup && (
        <div className="popup2-overlay">
          <div className="popup2-content">
            <p>Veuillez ajouter au moins une question avant de continuer.</p>
            <div className="popup2-buttons">
              <button className="btn-ok" onClick={() => setShowNoQuestionPopup(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

    </div >
  );
};

export default Creer_test;