function xmldb_conceptmap_upgrade($oldversion=0) {
    if ($oldversion < 20151231) {
        // Add new fields to certificate table.
        $table = new xmldb_table('concept-map');
        $field = new xmldb_field('showcode');
        $field->set_attributes(XMLDB_TYPE_INTEGER, '1', XMLDB_UNSIGNED, XMLDB_NOTNULL, null, '0', 'savecert');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        // Add new fields to certificate_issues table.
        $table = new xmldb_table('certificate_issues');
        $field = new xmldb_field('code');
        $field->set_attributes(XMLDB_TYPE_CHAR, '50', null, null, null, null, 'certificateid');
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
 
        // Certificate savepoint reached.
        upgrade_mod_savepoint(true, 2012091800, 'certificate');
    }
}