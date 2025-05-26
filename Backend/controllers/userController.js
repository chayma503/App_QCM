// controllers/userController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userModel = require('../Models/userModel');
const { findUserByEmail, createUser, verifyUserEmail, findUser_RoleByEmail, updatePasswordByEmail, findUserById, getAllUsers: fetchAllUsers, updateUserById } = require('../Models/userModel');
require('dotenv').config();


// --- LOGIN utilisateur ---
const loginUser = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Veuillez entrer votre email", field: "email" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Format de l'email invalide", field: "email" });
  }

  if (!mot_de_passe) {
    return res.status(400).json({ message: "Veuillez entrer votre mot de passe", field: "mot_de_passe" });
  }

  try {
    const user = await findUser_RoleByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Compte non trouvé", field: "email" });
    }

    const passwordMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect", field: "mot_de_passe" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Votre email n'a pas encore été confirmé.", field: "email" });
    }

    if (!user.is_approved) {
      return res.status(403).json({ message: "Votre compte est en attente de validation par l'administrateur.", field: "email" });
    }

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Erreur serveur :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Fonction pour envoyer un mail
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `http://localhost:5000/api/users/verify/${token}`;

  await transporter.sendMail({
    from: `"Vérification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Vérification de votre adresse e-mail',
    html: `<p>Merci de vous être inscrit. Cliquez ici pour vérifier :</p>
           <a href="${verificationLink}">${verificationLink}</a>`
  });
};

// Inscription
const registerUser = async (req, res) => {
  const { nom, prenom, email, mot_de_passe, confirmer_mot_de_passe, id_role } = req.body;

  try {
    if (!nom || !prenom || !email || !mot_de_passe || !confirmer_mot_de_passe || !id_role) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ field: 'email', message: 'Cet email est déjà utilisé.' });
    }

    if (mot_de_passe !== confirmer_mot_de_passe) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const user = await createUser(nom, prenom, email, hashedPassword, id_role);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Compte créé avec succès. Veuillez vérifier votre email.' });

  } catch (err) {
    console.error("Erreur backend :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Vérifie le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    await pool.query('UPDATE utilisateur SET is_verified = true WHERE id = $1', [userId]);

    res.status(200).send('Email confirmé avec succès. Vous êtes maintenant en attente de validation par un administrateur.');

  } catch (err) {
    console.error('Erreur lors de la vérification de l’email :', err);
    res.status(400).send('Lien de confirmation invalide ou expiré.');
  }
};




// Fonction pour envoyer un email de réinitialisation de mot de passe
const sendResetEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis." });
  }

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur avec cet email." });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Réinitialisation de mot de passe",
      html: `
        <h3>Bonjour ${user.nom},</h3>
        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
        <a href="${resetUrl}">Cliquez ici pour réinitialiser</a>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Lien de réinitialisation envoyé à l'adresse email." });

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token et nouveau mot de passe requis." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return res.status(400).json({ message: "Token invalide : email manquant." });
    }

    console.log("Email extrait du token :", email);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const rowCount = await updatePasswordByEmail(email, hashedPassword);

    console.log("Nombre de lignes modifiées :", rowCount);

    if (rowCount === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé pour cet email." });
    }

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });

  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", error);
    res.status(400).json({ message: "Lien invalide ou expiré." });
  }
};
//Fonction pour retourner les informations d’un utilisateur à partir de son id.


const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      password: user.mot_de_passe
    });

  } catch (error) {
    console.error("Erreur serveur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
//Fonction pour modifier le nom ou prenom
const updateName = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom } = req.body;

  try {
    await pool.query(
      'UPDATE utilisateur SET nom = $1, prenom = $2 WHERE id = $3',
      [nom, prenom, id]
    );
    return res.status(200).json({ message: 'Nom et prénom mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom/prénom :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

//fonctio pour mise a jour de tous le formulaire 

const updateAccount = async (req, res) => {
  const userId = req.params.id;
  const { nom, prenom, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // 1. Récupérer l'utilisateur depuis la base
    const userResult = await pool.query('SELECT * FROM utilisateur WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // 2. Si un nouveau mot de passe est fourni, vérifier l’ancien mot de passe
    if (newPassword && oldPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.mot_de_passe);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Les nouveaux mots de passe ne correspondent pas' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour avec le nouveau mot de passe
      await pool.query(
        'UPDATE utilisateur SET nom = $1, prenom = $2, mot_de_passe = $3 WHERE id = $4',
        [nom, prenom, hashedPassword, userId]
      );
    } else {
      // Mettre à jour sans changer le mot de passe
      await pool.query(
        'UPDATE utilisateur SET nom = $1, prenom = $2 WHERE id = $3',
        [nom, prenom, userId]
      );
    }

    res.status(200).json({ message: 'Compte mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compte :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT utilisateur.id, utilisateur.nom, utilisateur.prenom, utilisateur.email,
              utilisateur.id_role, role.type AS role, utilisateur.is_verified
       FROM utilisateur
       JOIN role ON utilisateur.id_role = role.id
       WHERE utilisateur.is_verified = true AND utilisateur.is_approved = false`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};



const acceptUser = async (req, res) => {
  const { userId } = req.params;

  try {
    await pool.query(`UPDATE utilisateur SET is_approved = true WHERE id = $1`, [userId]);

    const result = await pool.query(`SELECT email FROM utilisateur WHERE id = $1`, [userId]);
    const email = result.rows[0].email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vérification" < ${process.env.EMAIL_USER} >`,
      to: email,
      subject: 'Votre compte a été accepté',
      html: `
        <p>Félicitations ! Votre compte a été accepté par l'administrateur.</p>
        <p><a href="http://localhost:3000/">Cliquez ici pour vous connecter</a></p>
      `
    });

    res.json({ message: 'Utilisateur accepté.' });
  } catch (err) {
    console.error("Erreur acceptation :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const refuseUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`SELECT email FROM utilisateur WHERE id = $1`, [userId]);
    const email = result.rows[0].email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Vérification" < ${process.env.EMAIL_USER} >`,
      to: email,
      subject: 'Inscription refusée',
      html: `<p>Nous sommes désolés, votre compte a été refusé par l’administrateur.<br />
Vous pouvez refaire une inscription en choisissant un rôle différent.
      </p>`
    });

    await pool.query(`DELETE FROM utilisateur WHERE id = $1`, [userId]);

    res.json({ message: 'Utilisateur refusé et supprimé.' });
  } catch (err) {
    console.error("Erreur refus :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Erreur lors de la récupération de tous les utilisateurs :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await userModel.deleteUserById(userId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const updateUser = async (req, res) => {

  const { id } = req.params;
  const { nom, prenom, email, role } = req.body;

  try {
    const result = await updateUserById(id, nom, prenom, email, role);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
module.exports = {
  loginUser,
  registerUser,
  verifyEmail,
  sendResetEmail,
  resetPassword,
  getUserById,
  updateName,
  updateAccount,
  getAllUsers,
  refuseUser,
  acceptUser,
  getPendingUsers,
  deleteUser,
  updateUser
};
