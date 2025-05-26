<?php

return array(
    'meta' => array(
        'title' => 'ccc',
        'time_limit' => 20,
        'max_nb_questions' => 5,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        array(
            "Développenment backend",
            "À quoi sert une API REST dans le développement backend ?",
            array(
                "Une API REST sert uniquement à gérer la base de données locale" => false,
                "Une API REST permet de créer des animations côté client" => false,
                "Une API REST permet la communication entre le frontend et le backend via des requêtes HTTP" => true
            )
        ),
        array(
            "Développenment backend",
            "À quoi sert Express.js ?",
            array(
                "La Terre est plate" => false,
                "Le Soleil tourne autour de la Terre" => false,
                "La Terre tourne autour du Soleil" => true
            )
        ),
        array(
            "Développenment backend",
            "Cite un framework backend en Node.js.",
            array(
                "Express.js" => true,
                "React" => false,
                "Bootstrap" => false
            )
        ),
        array(
            "Développenment frontend",
            "Quelle est la différence entre Flexbox et Grid ?",
            array(
                "Flexbox et Grid sont identiques et peuvent être utilisés de manière interchangeable" => false,
                "Flexbox est utilisé pour les mises en page en 2D, tandis que Grid est uniquement utilisé pour les mises en page en 1D" => false,
                "Flexbox est une méthode de mise en page unidimensionnelle, tandis que Grid est une méthode bidimensionnelle" => true
            )
        ),
        array(
            "Développenment frontend",
            "Qu’est-ce que React ?",
            array(
                "React est un langage de programmation" => false,
                "React est un système d’exploitation" => false,
                "React est une bibliothèque JavaScript pour construire des interfaces utilisateur" => true
            )
        )
    )
);