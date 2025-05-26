// src/components/GestionUtilisateurs.js

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import './GererUtilisateurs.css';
import './Global.css';

const TabPanel = ({ children, value, index, ...other }) => (
    <div role="tabpanel" hidden={value !== index} {...other}>
        {value === index && (
            <Box className="tab-panel-content">
                <Typography component="div">{children}</Typography>
            </Box>
        )}
    </div>
);

const getRoleLabel = (roleId) => {
    switch (roleId) {
        case 1: return 'Administrateur';
        case 2: return 'Modérateur';
        case 3: return 'Utilisateur';
        default: return 'Inconnu';
    }
};

const GestionUtilisateurs = () => {
    const [user, setUser] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [admin, setAdmin] = useState({ nom: '', prenom: '', email: '' });
    const [showRejectPopup, setShowRejectPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [editingUserId, setEditingUserId] = useState(null);
    const [editedUserData, setEditedUserData] = useState({ nom: '', prenom: '', email: '', role: '' });
    const [showAccountInfo, setShowAccountInfo] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setAdmin({
                nom: parsedUser.nom,
                prenom: parsedUser.prenom,
                email: parsedUser.email
            });
        }
    }, []);
    useEffect(() => {
        // Récupération des infos utilisateur depuis localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            // Si aucun utilisateur, redirection vers login
            navigate("/", { state: { message: "Veuillez vous connecter." } });
        }
    }, [navigate]);

    const fetchUsers = async (type) => {
        try {
            const url = type === 'nouveaux'
                ? 'http://localhost:5000/api/users/utilisateurs/nouveaux'
                : 'http://localhost:5000/api/users/utilisateurs';

            const res = await fetch(url);
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur de récupération des utilisateurs', error);
        }
    };

    useEffect(() => {
        const view = tabValue === 0 ? 'nouveaux' : 'tous';
        fetchUsers(view);
    }, [tabValue]);

    const handleAccept = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/users/utilisateurs/accept/${userId}`, { method: 'POST' });
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Erreur lors de l'acceptation", error);
        }
    };

    const handleReject = async (userId) => {
        try {
            await fetch(`http://localhost:5000/api/users/utilisateurs/refuse/${userId}`, { method: 'POST' });
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (error) {
            console.error("Erreur lors du refus", error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/utilisateurs/delete/${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Erreur lors de la suppression');
            setUsers(prev => prev.filter(u => u.id !== userId));
            setShowDeletePopup(false);
        } catch (error) {
            console.error("Erreur lors de la suppression", error);
        }
    };

    const handleSaveEdit = async (userId) => {
        try {
            if (!editedUserData.nom || !editedUserData.prenom || !editedUserData.email) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            const res = await fetch(`http://localhost:5000/api/users/utilisateurs/update/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...editedUserData,
                    role: parseInt(editedUserData.role),
                }),
            });

            if (!res.ok) throw new Error('Erreur de mise à jour');
            const updatedUser = await res.json();

            setUsers(prev =>
                prev.map(u => u.id === userId ? { ...u, ...updatedUser } : u)
            );
            setEditingUserId(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur", error);
        }
    };

    const handleChangeTab = (newValue) => {
        setTabValue(newValue);
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
        <Box sx={{ p: 3 }}>
            <div className="white-box55">
                <div className="back-arrow" onClick={() => window.history.back()}>
                    <FaArrowLeft />
                </div>

                <Box sx={{ mb: 3 }}>
                    <span className="admin-title">Administrateur</span>
                    <Typography className="admin-info"><strong>Nom & Prénom:</strong> {admin.nom} {admin.prenom}</Typography>
                    <Typography className="admin-info"><strong>Email:</strong> {admin.email}</Typography>
                </Box>
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

                <div className="table-tabs">
                    <div className={`table-tab ${tabValue === 0 ? 'active' : ''}`} onClick={() => handleChangeTab(0)}>
                        Nouveaux utilisateurs
                    </div>
                    <div className={`table-tab ${tabValue === 1 ? 'active' : ''}`} onClick={() => handleChangeTab(1)}>
                        Tous les utilisateurs
                    </div>
                </div>

                <TabPanel value={tabValue} index={0}>
                    {users.filter(user => user.email !== admin.email).length === 0 ? (
                        <div className="no-users">Aucun utilisateur</div>
                    ) : (
                        <>
                            <div className="utilisateur-entete">
                                <span>Prénom</span>
                                <span>Nom</span>
                                <span>Email</span>
                                <span>Rôle</span>
                                <span>Actions</span>
                            </div>

                            <ul className="utilisateur-list">
                                {users.filter(user => user.email !== admin.email).map(user => (
                                    <li key={user.id} className="utilisateur-item">
                                        <span>{user.prenom}</span>
                                        <span>{user.nom}</span>
                                        <span>{user.email}</span>
                                        <span>{getRoleLabel(user.id_role)}</span>
                                        <span>
                                            <button className="btn-accept" onClick={() => handleAccept(user.id)}>Accepter</button>
                                            <button className="btn-reject" onClick={() => {
                                                setSelectedUserId(user.id);
                                                setShowRejectPopup(true);
                                            }}>Refuser</button>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    {users.filter(user => user.email !== admin.email).length === 0 ? (
                        <div className="no-users">Aucun utilisateur</div>
                    ) : (<>
                        <div className="utilisateur-entete">
                            <span>Prénom</span>
                            <span>Nom</span>
                            <span>Email</span>
                            <span>Rôle</span>
                            <span>Actions</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher par email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        <ul className="utilisateur-list">
                            {users
                                .filter(user => user.email !== admin.email)
                                .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(user => (

                                    <li key={user.id} className="utilisateur-item">
                                        {editingUserId === user.id ? (
                                            <>
                                                <span><input value={editedUserData.prenom} onChange={(e) => setEditedUserData(prev => ({ ...prev, prenom: e.target.value }))} /></span>
                                                <span><input value={editedUserData.nom} onChange={(e) => setEditedUserData(prev => ({ ...prev, nom: e.target.value }))} /></span>
                                                <span className="email-span">
                                                    <input
                                                        className="email-input "
                                                        value={editedUserData.email}
                                                        onChange={(e) => setEditedUserData(prev => ({ ...prev, email: e.target.value }))}
                                                    />
                                                </span>
                                                <span>
                                                    <select
                                                        value={editedUserData.role}
                                                        onChange={(e) => setEditedUserData(prev => ({ ...prev, role: e.target.value }))}
                                                        className="role-select"
                                                    >
                                                        <option value="1">Administrateur</option>
                                                        <option value="2">Modérateur</option>
                                                        <option value="3">Utilisateur</option>
                                                    </select>
                                                </span>
                                                <span>
                                                    <button className="btn-accept" onClick={() => handleSaveEdit(user.id)}>Enregistrer</button>
                                                    <button className="btn-reject" onClick={() => setEditingUserId(null)}>Annuler</button>
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{user.prenom}</span>
                                                <span>{user.nom}</span>
                                                <span>{user.email}</span>
                                                <span>{getRoleLabel(user.id_role)}</span>
                                                <span>
                                                    <button className="btn-modify" onClick={() => {
                                                        setEditingUserId(user.id);
                                                        setEditedUserData({
                                                            nom: user.nom,
                                                            prenom: user.prenom,
                                                            email: user.email,
                                                            role: user.id_role
                                                        });
                                                    }}>Modifier</button>
                                                    <button className="btn-delete" onClick={() => {
                                                        setSelectedUserId(user.id);
                                                        setShowDeletePopup(true);
                                                    }}>Supprimer</button>
                                                </span>
                                            </>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </>
                    )}
                </TabPanel>

                {
                    showRejectPopup && (
                        <div className="popup-overlay11">
                            <div className="popup-content11">
                                <p>Voulez-vous vraiment refuser cet utilisateur ?</p>
                                <div className="popup-buttons11">
                                    <button onClick={() => {
                                        handleReject(selectedUserId);
                                        setShowRejectPopup(false);
                                    }}>OK</button>
                                    <button onClick={() => setShowRejectPopup(false)}>Annuler</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showDeletePopup && (
                        <div className="popup-overlay11">
                            <div className="popup-content11">
                                <p>Voulez-vous vraiment supprimer cet utilisateur ?</p>
                                <div className="popup-buttons11">
                                    <button onClick={() => {
                                        handleDelete(selectedUserId);
                                        setShowDeletePopup(false);
                                    }}>OK</button>
                                    <button onClick={() => setShowDeletePopup(false)}>Annuler</button>
                                </div>
                            </div>
                        </div>
                    )
                }

                <img src="/images/back1.png" alt="Décoration" className="sidebar-image" />
            </div >
        </Box >
    );
};

export default GestionUtilisateurs; 