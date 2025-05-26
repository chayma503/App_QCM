<?php

return array(
    'meta' => array(
        'title' => 'testC',
        'time_limit' => 20,
        'max_nb_questions' => 1,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
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