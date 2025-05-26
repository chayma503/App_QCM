const express = require('express');
const router = express.Router();
const { getReponsesByQuestionId, ajouterReponse, deleteReponse, updateReponse, deleteReponsesByQuestion } = require('../controllers/reponsesController');
router.delete('/by-question/:id_question', deleteReponsesByQuestion);

// ✅ Route pour récupérer les réponses d'une question
router.get('/by-question/:id', getReponsesByQuestionId);

// ✅ Route pour ajouter une réponse
router.post('/', ajouterReponse); // ← à ajouter

// ✅ Route pour supprimer une réponse
router.delete('/:id', deleteReponse);

// ✅ Route pour mettre à jour une réponse
router.put('/:id', updateReponse);

module.exports = router;