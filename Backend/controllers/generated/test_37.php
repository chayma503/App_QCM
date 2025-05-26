<?php

return array(
    'meta' => array(
        'title' => 'fullStack2',
        'time_limit' => 20,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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
            "Développement full stack",
            "Quelle est l’utilité de MERN Stack ?",
            array(
                "Développer des applications web complètes en utilisant MongoDB, Express, React et Node.js." => true,
                "Créer des animations en 3D dans un navigateur." => false,
                "Gérer uniquement la base de données d’un site web." => false
            )
        ),
        array(
            "Développement full stack",
            "Donnez un avantage d’être full stack.",
            array(
                "Pouvoir gérer à la fois le frontend et le backend d’une application." => true,
                "Éviter complètement le travail en équipe." => false,
                "Se concentrer uniquement sur la base de données." => false,
                "Utiliser exclusivement des logiciels propriétaires." => false,
                "Ne coder que dans un seul langage." => false
            )
        )
    )
);