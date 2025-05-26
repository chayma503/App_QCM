<?php

return array(
    'meta' => array(
        'title' => 'lundi',
        'time_limit' => 20,
        'max_nb_questions' => 2,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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
            "Développement full stack",
            "Qu’est-ce qu’un développeur full stack ?",
            array(
                "Un développeur capable de travailler à la fois sur le frontend et le backend." => true,
                "Un développeur spécialisé uniquement dans les bases de données." => false,
                "Un développeur qui ne fait que du design d’interface." => false
            )
        )
    )
);