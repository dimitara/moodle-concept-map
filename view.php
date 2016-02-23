<?php

require_once('../../config.php');
require_once('lib.php');



 
$id = required_param('id', PARAM_INT);    // Course Module ID
 
if (!$cm = get_coursemodule_from_id('conceptmap', $id)) {
    print_error('Course Module ID was incorrect'); // NOTE this is invalid use of print_error, must be a lang string id
}
if (!$course = $DB->get_record('course', array('id'=> $cm->course))) {
    print_error('course is misconfigured');  // NOTE As above
}
if (!$conceptmap = $DB->get_record('conceptmap', array('id'=> $cm->instance))) {
    print_error('course module is incorrect'); // NOTE As above
}

$PAGE->set_context(context_system::instance());

//$PAGE->set_pagelayout('incourse');

print('<html>
    <head>
        <title>Concept map</title>
        <link rel="stylesheet" type="text/css" href="css/styles.css">
    </head>');
    echo $OUTPUT->header();
    print('<body>
        <div class="main">
            <div class="top-bar">
                <button onclick="addNode()">Add Concept</button>
                <button onclick="addRelation()">Add Relation</button>
                <button onclick="deleteSelected()">Delete</button>

                <button onclick="save()">Save</button>

                <i style="float:right">double click on a shape to select</i>
            </div>
            <div class="canvas">
                <svg id="canvas" style="border:solid 1px #4b5151" ></svg>
            </div>
        </div>');
        
        print('<script src="//code.jquery.com/jquery-1.12.0.min.js"></script>
        <script src="js/api.js"></script>
        <script src="js/concept.js"></script>
        <script src="js/relation.js"></script>
        <script src="js/snap.svg-min.js"></script>
        <script src="js/app.js"></script>
    </body>
</html>');