<?php

return array(
    'meta' => array(
        'title' => 'test',
        'time_limit' => 20,
        'max_nb_questions' => 1,
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
            )
    )
);