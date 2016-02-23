<?php


require_once('../../config.php');
require_once('lib.php');
 
$id = required_param('id', PARAM_INT);           // Course ID
 
// Ensure that the course specified is valid
//if (!$course = $DB->get_record('course', array('id'=> $id))) {
//    print_error('Course ID is incorrect');
//}


$PAGE->set_url('/mod/conceptmap/index.php', array('id' => $id));

if (!$course = $DB->get_record('course', array('id' => $id))) {
    print_error('invalidcourseid');
}

require_login($course, true);
$PAGE->set_pagelayout('incourse');
$context = context_course::instance($course->id);

$event = \mod_conceptmap\event\course_module_instance_list_viewed::create(array('context' => $context));
$event->add_record_snapshot('course', $course);
$event->trigger();

/// Get all required stringsmaps
$strmaps = get_string("modulenameplural", "conceptmaps");
$strmap = get_string("modulename", "conceptmap");

/// Print the header
$PAGE->navbar->add($strmaps, "index.php?id=$course->id");
$PAGE->set_title($strmaps);
$PAGE->set_heading($course->fullname);
echo $OUTPUT->header();
echo $OUTPUT->heading($strmaps);

/// Get all the appropriate data
if (!$maps = get_all_instances_in_course("conceptmap", $course)) {
    notice("There are no conceptmaps", "../../course/view.php?id=$course->id");
    die;
}

$usesections = course_format_uses_sections($course->format);

/// Print the list of instances (your module will probably extend this)

$timenow = time();
$strname = get_string("name");
$table = new html_table();

if ($usesections) {
    $strsectionname = get_string('sectionname', 'format_' . $course->format);
    $table->head = array($strsectionname, $strname);
} else {
    $table->head = array($strname);
}

foreach ($maps as $map) {
    $linkcss = null;
    if (!$map->visible) {
        $linkcss = array('class' => 'dimmed');
    }
    $link = html_writer::link(new moodle_url('/mod/conceptmap/view.php', array('id' => $map->coursemodule)), $map->name, $linkcss);

    if ($usesections) {
        $table->data[] = array(get_section_name($course, $map->section), $link);
    } else {
        $table->data[] = array($link);
    }
}

echo html_writer::table($table);

/// Finish the page
echo $OUTPUT->footer();
