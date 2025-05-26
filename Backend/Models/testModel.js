const pool = require('../config/db'); // Chemin correct vers votre fichier db.js
const fs = require('fs');
const path = require('path');

// Fonction pour insérer un test dans la base de données
const insertTest = async (titre, time_limit, statut, nb_question_max, id_utilisateur) => {
    const insertTestQuery = `
        INSERT INTO test (titre, time_limit, statut, nb_question_max, id_utilisateur)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;
    const result = await pool.query(insertTestQuery, [titre, time_limit, statut, nb_question_max, id_utilisateur]);
    return result.rows[0].id;
};

// Fonction pour récupérer une question avec ses réponses
const getQuestionAndReponses = async (questionId) => {
    const questionRes = await pool.query(
        `SELECT q.id, q.question, c.nom AS categorie
         FROM question q
         JOIN categorie c ON q.id_categorie = c.id
         WHERE q.id = $1`,
        [questionId]
    );
    const questionData = questionRes.rows[0];

    if (!questionData) {
        throw new Error(`Question avec l'ID ${questionId} non trouvée.`);
    }

    const reponsesRes = await pool.query(
        `SELECT reponse, status FROM reponse WHERE id_question = $1`,
        [questionId]
    );
    const reponses = {};
    reponsesRes.rows.forEach(r => {
        reponses[r.reponse] = r.status;
    });

    return { questionData, reponses };
};

// Fonction pour générer un fichier PHP pour le test
const generatePHPFile = (testId, titre, time_limit, statut, nb_question_max, enrichedQuestions) => {
    const phpContent = `<?php

return array(
    'meta' => array(
        'title' => '${titre}',
        'time_limit' => ${time_limit},
        'max_nb_questions' => ${nb_question_max},
        'status' => '${statut}' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        ${enrichedQuestions.map(q => {
        const intitule = q.intitule.replace(/"/g, '\\"');
        const categorie = q.categorie.replace(/"/g, '\\"');
        const reponsesPHP = Object.entries(q.reponses).map(([rep, status]) =>
            `"${rep.replace(/"/g, '\\"')}" => ${status ? 'true' : 'false'}`
        ).join(',\n                ');

        return `array(
                "${categorie}",
                "${intitule}",
                array(
                    ${reponsesPHP}
                )
            )`;
    }).join(',\n        ')}
    )
);`;

    const generatedDir = path.join(__dirname, 'generated');
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }

    const fileName = `test_${testId}.php`;
    const filePath = path.join(generatedDir, fileName);
    fs.writeFileSync(filePath, phpContent);

    return filePath;
};

module.exports = {
    insertTest,
    getQuestionAndReponses,
    generatePHPFile
};
