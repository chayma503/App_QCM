<?php

return array(
    'meta' => array(
        'title' => 'aaa',
        'time_limit' => 20,
        'max_nb_questions' => 4,
        'status' => 'disponible' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        array(
            "Développenment backend",
            "Qu’est-ce qu’une API REST ?",
            array(
                "Une interface qui permet la communication entre applications via HTTP." => true,
                "Un langage utilisé pour coder des interfaces graphiques." => false,
                "Un outil pour créer des bases de données locales." => false
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
            "Qu’est-ce que React ?",
            array(
                "React est un langage de programmation" => false,
                "React est un système d’exploitation" => false,
                "React est une bibliothèque JavaScript pour construire des interfaces utilisateur" => true
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
        )
    )
);