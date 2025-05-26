<?php

return array(
    'meta' => array(
        'title' => 'python, C/C++',
        'time_limit' => 50,
        'max_nb_questions' => 6,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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
            ),
        array(
                "Langage de programmation PYTHON",
                "Cite une librairie populaire en Python.",
                array(
                    "Pandas." => true,
                "WindowsLib." => false
                )
            ),
        array(
                "Langage de programmation PYTHON",
                "Comment créer une fonction en Python ?",
                array(
                    "Avec le mot-clé def." => true,
                "Avec la commande create." => false,
                "Avec une boucle while." => false
                )
            ),
        array(
                "Langage de programmation PYTHON",
                "Qu’est-ce qu’une liste en Python ?",
                array(
                    "Une structure de données ordonnée et modifiable." => true,
                "Un fichier contenant du code Python." => false,
                "Une boucle conditionnelle." => false
                )
            )
    )
);