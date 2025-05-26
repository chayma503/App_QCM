const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Fonction pour générer un test
exports.generateTest = async (req, res) => {
    const { titre, time_limit, statut, nb_question_max, id_utilisateur, questions } = req.body;

    try {
        // 1. Insérer le test dans la base de données
        const insertTestQuery = `
            INSERT INTO test (titre, time_limit, statut, nb_question_max, id_utilisateur)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const result = await pool.query(insertTestQuery, [titre, time_limit, statut, nb_question_max, id_utilisateur]);
        const testId = result.rows[0].id;

        // 2. Récupérer pour chaque question : son titre, sa catégorie et ses réponses
        const enrichedQuestions = [];

        for (const q of questions) {
            if (!q.id) {
                throw new Error('Une question est sans ID');
            }

            // Récupérer la question
            const questionRes = await pool.query(
                `SELECT q.id, q.question, c.nom AS categorie
                 FROM question q
                 JOIN categorie c ON q.id_categorie = c.id
                 WHERE q.id = $1`,
                [q.id]
            );

            const questionData = questionRes.rows[0];

            if (!questionData) {
                throw new Error(`Question avec l'ID ${q.id} non trouvée.`);
            }

            // Récupérer les réponses
            const reponsesRes = await pool.query(
                `SELECT reponse, status FROM reponse WHERE id_question = $1`,
                [q.id]
            );

            const reponses = {};
            reponsesRes.rows.forEach(r => {
                reponses[r.reponse] = r.status;
            });

            enrichedQuestions.push({
                categorie: questionData?.categorie || "Sans catégorie",
                intitule: questionData?.question || "Question sans titre",
                reponses
            });

            // Ajouter la question dans la table test_question
            await pool.query(
                `INSERT INTO test_question (id_test, id_question) VALUES ($1, $2)`,
                [testId, questionData.id]
            );
        }

        // 3. Générer le fichier PHP
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

        // 4. Écriture du fichier PHP
        const generatedDir = path.join(__dirname, 'generated');
        if (!fs.existsSync(generatedDir)) {
            fs.mkdirSync(generatedDir);
        }
        // Nettoie le titre pour éviter les caractères spéciaux dangereux dans un nom de fichier
        const safeTitle = titre.replace(/[^a-zA-Z0-9_-]/g, "_");
        const fileName = `${safeTitle}.php`;
        const filePath = path.join(generatedDir, fileName);
        fs.writeFileSync(filePath, phpContent);

        // 5. Réponse à l'utilisateur
        res.status(200).json({
            message: 'Test enregistré et fichier PHP généré',
            testId,
            downloadUrl: `/api/tests/download/${fileName}`
        });

    } catch (error) {
        console.error('Erreur génération test :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Fonction pour télécharger le fichier généré
exports.downloadTestFile = (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, 'generated', fileName);

    // Vérifie si le fichier existe avant de tenter de le télécharger
    if (fs.existsSync(filePath)) {
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Erreur lors du téléchargement du fichier:', err);
                res.status(500).send('Erreur lors du téléchargement');
            }
        });
    } else {
        res.status(404).send('Fichier non trouvé');
    }
};

// Fonction pour récupérer tous les tests
exports.getAllTests = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM test ORDER BY titre ASC'); // Tri décroissant si tu veux les plus récents d'abord
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des tests :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// Fonction pour récupérer les catégories, questions et réponses d’un test
exports.getFullTestDetails = async (req, res) => {
    const { testId } = req.params;

    try {
        const testQuestions = await pool.query(`
      SELECT q.id AS question_id, q.question, c.id AS categorie_id, c.nom AS categorie_nom
      FROM test_question tq
      JOIN question q ON tq.id_question = q.id
      JOIN categorie c ON q.id_categorie = c.id
      WHERE tq.id_test = $1
    `, [testId]);

        const categoriesMap = {};

        for (const row of testQuestions.rows) {
            const { question_id, question, categorie_id, categorie_nom } = row;

            const reponsesRes = await pool.query(`
        SELECT id, reponse, status FROM reponse WHERE id_question = $1
      `, [question_id]);

            const questionObj = {
                id: question_id,
                question,
                reponses: reponsesRes.rows,
            };

            if (!categoriesMap[categorie_id]) {
                categoriesMap[categorie_id] = {
                    id: categorie_id,
                    nom: categorie_nom,
                    questions: [],
                };
            }

            categoriesMap[categorie_id].questions.push(questionObj);
        }

        const categoriesWithQuestions = Object.values(categoriesMap);
        res.status(200).json(categoriesWithQuestions);
    } catch (err) {
        console.error('Erreur lors de la récupération du test complet :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un test
exports.deleteTest = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM test_question WHERE id_test = $1', [id]);
        await pool.query('DELETE FROM test WHERE id = $1', [id]);

        res.status(200).json({ message: 'Test supprimé avec succès' });
    } catch (error) {
        console.error('Erreur suppression test :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du test' });
    }
};


//fonction pour retourner les catégories d'un test
exports.getTestCategories = async (req, res) => {
    const { testId } = req.params;

    try {
        const result = await pool.query(`
            SELECT DISTINCT c.id, c.nom
            FROM test_question tq
            JOIN question q ON tq.id_question = q.id
            JOIN categorie c ON q.id_categorie = c.id
            WHERE tq.id_test = $1
        `, [testId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories du test :', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
