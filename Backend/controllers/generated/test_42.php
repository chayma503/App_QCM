<?php

return array(
    'meta' => array(
        'title' => 'test_demo2',
        'time_limit' => 20,
        'max_nb_questions' => 2,
        'status' => 'available' // {'available', 'deactivated', 'hidden'}
    ),
    'questions' => array(
        array(
            "Langage de programmation PYTHON",
            "exemple question ",
            array(
                "1" => true,
                "2" => false,
                "3" => false,
                "" => false
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