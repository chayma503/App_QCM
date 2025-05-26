<?php

return array(
    'meta' => array(
        'title' => 'test_démo5',
        'time_limit' => 50,
        'max_nb_questions' => 6,
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
            "Cite un langage utilisé en frontend.",
            array(
                "HTML" => true,
                "Python" => false,
                "MySQL" => false
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