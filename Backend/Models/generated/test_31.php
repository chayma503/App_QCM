<?php

return array(
    'meta' => array(
        'title' => 'test5',
        'time_limit' => 50,
        'max_nb_questions' => 3,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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