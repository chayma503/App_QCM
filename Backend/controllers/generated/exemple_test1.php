<?php

return array(
    'meta' => array(
        'title' => 'exemple_test1',
        'time_limit' => 20,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        array(
            "Développenment frontend",
            "Qu’est-ce que React ?",
            array(
                "React est un langage de programmation" => false,
                "React est un système d’exploitation" => false,
                "React est une bibliothèque JavaScript pour construire des interfaces utilisateur" => true
            )
        ),
        array(
            "Développement full stack",
            "Qu’est-ce qu’un développeur full stack ?",
            array(
                "Un développeur capable de travailler à la fois sur le frontend et le backend." => true,
                "Un développeur spécialisé uniquement dans les bases de données." => false,
                "Un développeur qui ne fait que du design d’interface." => false
            )
        ),
        array(
            "exemple_catégorie",
            "exemple_question1",
            array(
                "1" => true,
                "2" => false,
                "3" => false
            )
        )
    )
);