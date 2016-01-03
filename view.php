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