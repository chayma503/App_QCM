import React, { useState, useEffect } from "react";
import "./Supprimer.css";
import "./Global.css";
import {
    FaArrowLeft, FaRegEdit,
    FaPlusSquare,
    FaEye,
    FaUserCircle,
    FaUserCog,
    FaSignOutAlt,
} from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Supprimer = () => {
    const [selectedOption, setSelectedOption] = useState("categorie");
    const [categories, setCategories] = useState([]);
    const [tests, setTests] = useState([]);
    const [expandedCategoryId, setExpandedCategoryId] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [showDeleteTestPopup, setShowDeleteTestPopup] = useState(false);
    const [testToDelete, setTestToDelete] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [showAccountInfo, setShowAccountInfo] = useState(false);

    const toggleAccountInfo = () => {
        setShowAccountInfo(!showAccountInfo);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/", { state: { message: "Déconnexion réussie" } });
    };


    const handleDeleteCategory = (id) => {
        setCategoryToDelete(id);
        setShowDeletePopup(true);
    };

    const confirmDeleteCategory = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/categories/${categoryToDelete}`);
            fetchCategories();
            setExpandedCategoryId(null);
        } catch (error) {
            console.error("Erreur suppression catégorie :", error);
        } finally {
            setShowDeletePopup(false);
            setCategoryToDelete(null);
        }
    };
    const handleDeleteTest = (id) => {
        setTestToDelete(id);
        setShowDeleteTestPopup(true);
    };

    const confirmDeleteTest = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/tests/tests/${testToDelete}`);
            fetchTests();
        } catch (error) {
            console.error("Erreur suppression test :", error);
        } finally {
            setShowDeleteTestPopup(false);
            setTestToDelete(null);
        }
    };


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate("/", { state: { message: "Veuillez vous connecter." } });
        }
    }, [navigate]);
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/categories/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Erreur chargement catégories :", error);
        }
    };

    const fetchTests = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/tests/tests");
            setTests(response.data);
        } catch (error) {
            console.error("Erreur chargement tests :", error);
        }
    };


    const handleCategoryClick = (id) => {
        if (expandedCategoryId === id) {
            setExpandedCategoryId(null);
        } else {
            setExpandedCategoryId(id);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCategories();
            fetchTests();
        }
    }, [user]);
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
        <div className="white-box9">
            <div className="back-arrow" onClick={() => window.history.back()}>
                <FaArrowLeft />
            </div>
            <span className="titre-supprimer">Supprimer un test / une catégorie</span>

            <table className="tableau-suppression">
                <thead>
                    <tr>
                        <th
                            className={`clickable-header ${selectedOption === "categorie" ? "selected" : ""}`}
                            onClick={() => setSelectedOption("categorie")}
                        >
                            Supprimer Catégorie
                        </th>

                        <th
                            className={`clickable-header ${selectedOption === "test" ? "selected" : ""}`}
                            onClick={() => setSelectedOption("test")}
                        >
                            Supprimer Test
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {selectedOption === "test" && tests.length > 0 ? (
                        tests.map((test) => (
                            <tr key={test.id}>
                                <td colSpan="1"> <span className="item-text clickable-text">{test.titre}</span></td>
                                <td>
                                    <button className="supprimer-button" onClick={() => handleDeleteTest(test.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : selectedOption === "categorie" && categories.length > 0 ? (
                        categories.map((cat) => (
                            <tr key={cat.id}>
                                <td colSpan="1">  <span
                                    className="item-text clickable-text"
                                    onClick={() => handleCategoryClick(cat.id)}
                                >
                                    {cat.nom}
                                </span></td>
                                <td>
                                    <button className="supprimer-button" onClick={() => handleDeleteCategory(cat.id)}>Supprimer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">
                                {selectedOption === "test" ? "Aucun test trouvé." : "Aucune catégorie trouvée."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


            <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />

            {showDeletePopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>Voulez-vous vraiment supprimer cette catégorie ?</p>
                        <div className="popup-buttons">
                            <button onClick={confirmDeleteCategory}>OK</button>
                            <button onClick={() => setShowDeletePopup(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteTestPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <p>Voulez-vous vraiment supprimer ce test ?</p>
                        <div className="popup-buttons">
                            <button onClick={confirmDeleteTest}>OK</button>
                            <button onClick={() => setShowDeleteTestPopup(false)}>Annuler</button>
                        </div>
                    </div>
                </div>
            )}
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

    );
};

export default Supprimer;