const qcmModel = require("../Models/qcmModel");

// Fonction pour ajouter un QCM
const ajouterQCM = async (req, res) => {
    const { categorie, question, reponses, useCategorieExistante } = req.body;
    try {
        await qcmModel.ajouterQCM(categorie, question, reponses, useCategorieExistante);
        res.status(200).json({ message: "QCM ajouté avec succès" });
    } catch (error) {
        console.error("Erreur lors de l'ajout du QCM :", error);

        if (error.message === "CATEGORIE_EXISTE") {
            return res.status(400).json({ message: "La catégorie existe déjà." });
        }

        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Fonction pour récupérer les catégories
const getCategories = async (req, res) => {
    try {
        const categories = await qcmModel.getCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const modifierQCM = async (req, res) => {
    const { questionId, nouvelleQuestion, nouvellesReponses } = req.body;
    try {
        // Mettre à jour la question
        await qcmModel.updateQuestion(questionId, nouvelleQuestion);

        // Supprimer les anciennes réponses
        await qcmModel.deleteReponsesByQuestionId(questionId);

        // Réinsérer les nouvelles réponses
        for (const rep of nouvellesReponses) {
            await qcmModel.insertReponse(questionId, rep.reponse, rep.status, rep.id_utilisateur);
        }

        res.status(200).json({ message: "QCM modifié avec succès" });
    } catch (error) {
        console.error("Erreur lors de la modification du QCM :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    ajouterQCM,
    getCategories, modifierQCM
};
