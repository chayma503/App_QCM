const pool = require("../config/db");

// Fonction pour ajouter un QCM
const ajouterQCM = async (categorie, question, reponses, useCategorieExistante) => {
    let categorieId;

    if (useCategorieExistante) {
        // catégorie est l’ID directement
        categorieId = categorie;
    } else {
        // Vérifie si la catégorie existe déjà (insensible à la casse)
        const checkResult = await pool.query(
            "SELECT id FROM categorie WHERE LOWER(nom) = LOWER($1)",
            [categorie]
        );

        if (checkResult.rows.length > 0) {
            // La catégorie existe déjà
            throw new Error("CATEGORIE_EXISTE");
        }

        // Sinon, on l'insère
        const catResult = await pool.query(
            "INSERT INTO categorie (nom) VALUES ($1) RETURNING id",
            [categorie]
        );
        categorieId = catResult.rows[0].id;
    }

    // Insertion de la question
    const questionResult = await pool.query(
        "INSERT INTO question (question, id_categorie) VALUES ($1, $2) RETURNING id",
        [question, categorieId]
    );
    const questionId = questionResult.rows[0].id;

    // Insertion des réponses
    for (const rep of reponses) {
        await pool.query(
            "INSERT INTO reponse (reponse, status, id_question, id_utilisateur) VALUES ($1, $2, $3, $4)",
            [rep.reponse, rep.status, questionId, rep.id_utilisateur]
        );
    }
};


// Fonction pour récupérer toutes les catégories
const getCategories = async () => {
    const result = await pool.query("SELECT id, nom FROM categorie");
    return result.rows;
};



module.exports = {
    ajouterQCM,
    getCategories
};
