const pool = require("../config/db");

const getQuestionsByCategory = async (categoryId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM question WHERE id_categorie = $1',
            [categoryId]
        );
        return result.rows;
    } catch (err) {
        throw new Error('Erreur récupération questions : ' + err.message);
    }
};

// ✅ Fonction pour supprimer une question par ID
const deleteQuestion = async (questionId) => {
    const query = 'DELETE FROM question WHERE id = $1';
    await pool.query(query, [questionId]);
};

const updateQuestion = async (id, questionText) => {
    const query = 'UPDATE question SET question = $1 WHERE id = $2';
    const values = [questionText, id];
    await pool.query(query, values);
};

module.exports = { getQuestionsByCategory, deleteQuestion, updateQuestion };
