const reponseModel = require("../Models/reponseModel");

// Fonction pour récupérer les réponses d'une question
const getReponsesByQuestionId = async (req, res) => {
    const questionId = req.params.id;

    try {
        const reponses = await reponseModel.getReponsesByQuestionId(questionId);
        res.json(reponses);
    } catch (err) {
        console.error('Erreur récupération réponses :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteReponsesByQuestion = async (req, res) => {
    try {
        const { id_question } = req.params;
        await reponseModel.deleteReponsesByQuestionId(parseInt(id_question));
        res.status(200).json({ message: "Toutes les réponses ont été supprimées pour cette question." });
    } catch (error) {
        console.error('Erreur suppression réponses :', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression des réponses' });
    }
};


const updateReponse = async (req, res) => {
    const id = req.params.id;
    const { reponse, status } = req.body;
    try {
        await reponseModel.updateReponse(id, reponse, status);
        res.status(200).json({ message: "Réponse mise à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const deleteReponse = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Suppression de la réponse avec ID :", id);
        await deleteReponseById(parseInt(id));
        res.status(200).json({ message: 'Réponse supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la réponse :', error.message);
        res.status(500).json({ error: 'Erreur lors de la suppression de la réponse' });
    }
};

const ajouterReponse = async (req, res) => {
    const { reponse, status, id_question, id_utilisateur } = req.body;

    if (!reponse || id_question == null || id_utilisateur == null) {
        return res.status(400).json({ message: "Données manquantes" });
    }

    try {
        await reponseModel.insertReponse(id_question, reponse, status, id_utilisateur);
        res.status(201).json({ message: "Réponse ajoutée avec succès" });
    } catch (error) {
        console.error("Erreur ajout réponse :", error);
        res.status(500).json({ message: "Erreur serveur lors de l'ajout" });
    }
};
module.exports = {
    getReponsesByQuestionId, deleteReponsesByQuestion, updateReponse, deleteReponse, ajouterReponse
};
