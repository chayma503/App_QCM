const questionModel = require("../Models/questionModel");

const getQuestionsByCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const questions = await questionModel.getQuestionsByCategory(categoryId);
        res.json(questions);
    } catch (err) {
        console.error('Erreur récupération questions :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Fonction pour supprimer une question
const deleteQuestion = async (req, res) => {
    const questionId = req.params.id;
    try {
        await questionModel.deleteQuestion(questionId);
        res.status(200).json({ message: "Question supprimée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const updateQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { question } = req.body;

    try {
        await questionModel.updateQuestion(questionId, question);
        res.status(200).json({ message: "Question mise à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la question :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getQuestionsByCategory, deleteQuestion, updateQuestion };
