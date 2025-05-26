// models/userModel.js

const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM utilisateur WHERE email = $1', [email]);
    return result.rows[0];
};

const createUser = async (nom, prenom, email, hashedPassword, id_role) => {
    const result = await pool.query(
        `INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, id_role, is_verified)
     VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
        [nom, prenom, email, hashedPassword, id_role]
    );
    return result.rows[0];
};

const verifyUserEmail = async (userId) => {
    const result = await pool.query(
        'UPDATE utilisateur SET is_verified = true WHERE id = $1 RETURNING *',
        [userId]
    );
    return result.rows[0];
};
const findUser_RoleByEmail = async (email) => {
    const result = await pool.query(
        `SELECT utilisateur.*, role.type AS role 
     FROM utilisateur 
     JOIN role ON utilisateur.id_role = role.id 
     WHERE utilisateur.email = $1`,
        [email]
    );
    return result.rows[0]; // On retourne seulement l'utilisateur trouvé
};

// Fonction pour mettre à jour le mot de passe de l'utilisateur
const updatePasswordByEmail = async (email, hashedPassword) => {
    const result = await pool.query(
        "UPDATE utilisateur SET mot_de_passe = $1 WHERE email = $2",
        [hashedPassword, email]
    );
    return result.rowCount;
};
//Fonction pour retourner les informations d’un utilisateur à partir de son id.

const findUserById = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error("ID utilisateur invalide.");
    }
    const query = `
    SELECT utilisateur.id, nom, prenom, email, role.type AS role
    FROM utilisateur
    JOIN role ON utilisateur.id_role = role.id
    WHERE utilisateur.id = $1
  `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};


const getPendingUsers = async () => {
    const result = await pool.query(`
      SELECT utilisateur.*, role.type AS role 
      FROM utilisateur
      JOIN role ON utilisateur.id_role = role.id
      WHERE is_verified = true AND is_approved = false
    `);
    return result.rows;
};
const getAllUsers = async () => {
    const result = await pool.query(`
      SELECT utilisateur.*, role.type AS role 
      FROM utilisateur
      JOIN role ON utilisateur.id_role = role.id
      WHERE utilisateur.is_verified = true AND utilisateur.is_approved = true
    `);
    return result.rows;
};

const deleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM utilisateur WHERE id = $1', [id]);
    return result;
};
const updateUserById = async (id, nom, prenom, email, role) => {
    const result = await pool.query(
        'UPDATE utilisateur SET nom = $1, prenom = $2, email = $3, id_role = $4 WHERE id = $5 RETURNING *',

        [nom, prenom, email, role, id]
    );
    return result;
};

module.exports = {
    findUser_RoleByEmail,
    findUserByEmail,
    createUser,
    verifyUserEmail,
    updatePasswordByEmail,
    findUserById,
    getPendingUsers,
    getAllUsers,
    deleteUserById,
    updateUserById
};
