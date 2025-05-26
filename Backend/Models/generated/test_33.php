<?php

return array(
    'meta' => array(
        'title' => 'test4',
        'time_limit' => 20,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
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
                "Développenment backend",
                "À quoi sert une API REST dans le développement backend ?",
                array(
                    "Une API REST sert uniquement à gérer la base de données locale" => false,
                "Une API REST permet de créer des animations côté client" => false,
                "Une API REST permet la communication entre le frontend et le backend via des requêtes HTTP" => true
                )
            )
    )
);