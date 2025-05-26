<?php

return array(
    'meta' => array(
        'title' => 'exp',
        'time_limit' => 50,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        array(
            "Cybersécurité",
            "Quel est un exemple de mot de passe sécurisé ?",
            array(
                "nomutilisateur " => false,
                "123456 " => false,
                "P@ssw0rd!2024 " => true
            )
        ),
        array(
            "Cybersécurité",
            "Quel est l'objectif principal d'un pare-feu (firewall) ?",
            array(
                "Filtrer le trafic réseau entrant et sortant selon des règles prédéfinies. " => true,
                "Accélérer la vitesse de la connexion Internet. " => false,
                "Créer automatiquement des sauvegardes de données. " => false,
                "ex" => false
            )
        ),
        array(
            "Cybersécurité",
            "Quel comportement est le plus sûr face à un e-mail suspect ?",
            array(
                "Répondre pour demander plus d’informations " => false,
                "Ne pas cliquer sur les liens et supprimer l’e-mail " => true,
                "exemple" => false
            )
        )
    )
);