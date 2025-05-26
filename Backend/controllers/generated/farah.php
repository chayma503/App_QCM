<?php

return array(
    'meta' => array(
        'title' => 'farah',
        'time_limit' => 20,
        'max_nb_questions' => 1,
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
        )
    )
);