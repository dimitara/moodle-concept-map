if (!defined('MOODLE_INTERNAL')) {
    die('Direct access to this script is forbidden.');    ///  It must be included from a Moodle page
}
 
require_once($CFG->dirroot.'/course/moodleform_mod.php');
require_once($CFG->dirroot.'/mod/conceptmap/lib.php');
 
class mod_conceptmap_mod_form extends moodleform_mod {
 
    function definition() {
        global $CFG, $DB, $OUTPUT;
 
        $mform =& $this->_form;
 
        $mform->addElement('text', 'name', get_string('conceptmapname', 'conceptmap'), array('size'=>'64'));
        $mform->setType('name', PARAM_TEXT);
        $mform->addRule('name', null, 'required', null, 'client');
 
        $ynoptions = array(0 => get_string('no'),
                           1 => get_string('yes'));
        $mform->addElement('select', 'usecode', get_string('usecode', 'conceptmap'), $ynoptions);
        $mform->setDefault('usecode', 0);
        $mform->addHelpButton('usecode', 'usecode', 'conceptmap');
 
        $this->standard_coursemodule_elements();
 
        $this->add_action_buttons();
    }
}