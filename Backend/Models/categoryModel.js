const pool = require("../config/db");

// Fonction pour récupérer toutes les catégories triées par ordre alphabétique
const getAllCategoriesFromDB = async () => {
    const result = await pool.query('SELECT * FROM categorie ORDER BY nom ASC');
    return result.rows;
};

module.exports = { getAllCategoriesFromDB };
