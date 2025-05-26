<?php

return array(
    'meta' => array(
        'title' => 'python',
        'time_limit' => 40,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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