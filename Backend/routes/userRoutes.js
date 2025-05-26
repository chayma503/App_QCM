const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, sendResetEmail, resetPassword, getUserById, updateName, updateAccount, getPendingUsers, acceptUser, refuseUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');



router.post('/register', registerUser);
router.post("/login", loginUser);
router.get('/verify/:token', verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", sendResetEmail);
router.get('/user/:id', getUserById);
router.put('/update-name/:id', updateName);
router.put('/update-account/:id', updateAccount);
// Récupérer les utilisateurs non validés
router.get('/utilisateurs/nouveaux', getPendingUsers);
router.put('/utilisateurs/update/:id', updateUser);
// Accepter un utilisateur
router.post('/utilisateurs/accept/:userId', acceptUser);

// Refuser un utilisateur
router.post('/utilisateurs/refuse/:userId', refuseUser);

router.get('/utilisateurs', getAllUsers);

router.delete('/utilisateurs/delete/:id', deleteUser);






module.exports = router;
