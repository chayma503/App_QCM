<?php

return array(
    'meta' => array(
        'title' => 'test4',
        'time_limit' => 20,
        'max_nb_questions' => 6,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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
            "Qu’est-ce qu’un développeur full stack ?",
            array(
                "Un développeur capable de travailler à la fois sur le frontend et le backend." => true,
                "Un développeur spécialisé uniquement dans les bases de données." => false,
                "Un développeur qui ne fait que du design d’interface." => false
            )
        ),
        array(
            "Langage de programmation C/C++",
            "À quoi sert malloc en C ?",
            array(
                "À allouer dynamiquement de la mémoire pendant l’exécution." => true,
                "À libérer la mémoire automatiquement." => false,
                "À initialiser les variables à zéro." => false,
                "À créer une boucle infinie." => false
            )
        ),
        array(
            "Langage de programmation C/C++",
            "Quelle est la différence entre C et C++ ?",
            array(
                "C++ supporte la programmation orientée objet, contrairement à C." => true,
                "C++ est uniquement utilisé pour développer des pages web." => false,
                "C est plus récent que C++." => false,
                "C++ ne permet pas la manipulation bas niveau." => false
            )
        ),
        array(
            "Langage de programmation C/C++",
            "Qu’est-ce qu’un pointeur en C ?",
            array(
                "Une variable qui contient l’adresse mémoire d’une autre variable." => true,
                "Une fonction qui alloue de la mémoire automatiquement." => false,
                "Une structure contenant plusieurs variables." => false,
                "Un type spécial réservé aux boucles." => false
            )
        )
    )
);