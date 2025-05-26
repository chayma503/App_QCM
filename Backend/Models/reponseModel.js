const pool = require("../config/db");

// Fonction pour récupérer les réponses d'une question
const getReponsesByQuestionId = async (questionId) => {
    try {
        const result = await pool.query(
            'SELECT reponse, status FROM reponse WHERE id_question = $1',
            [questionId]
        );
        return result.rows;
    } catch (err) {
        throw new Error('Erreur récupération réponses : ' + err.message);
    }
};


const deleteReponsesByQuestionId = async (questionId) => {
    await pool.query(
        "DELETE FROM reponse WHERE id_question = $1",
        [questionId]
    );
};

const updateReponse = async (id, reponse, status) => {
    const query = 'UPDATE reponse SET reponse = $1, status = $2 WHERE id = $3';
    await pool.query(query, [reponse, status, id]);
};

const deleteReponseById = async (id) => {
    if (!id || isNaN(id)) {
        throw new Error('ID invalide pour la suppression : ${ id }');
    }

    const query = 'DELETE FROM reponse WHERE id = $1';
    await pool.query(query, [id]);
};

const insertReponse = async (id_question, reponse, status, id_utilisateur) => {
    const query = `
        INSERT INTO reponse (id_question, reponse, status, id_utilisateur)
        VALUES ($1, $2, $3, $4)
    `;
    const values = [id_question, reponse, status, id_utilisateur];
    await pool.query(query, values);
};
module.exports = {
    getReponsesByQuestionId, deleteReponsesByQuestionId, updateReponse, deleteReponseById, insertReponse
};
