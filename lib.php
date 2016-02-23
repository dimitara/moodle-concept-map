<?php

function conceptmap_add_instance($conceptmap){
    global $DB;

    $conceptmap->mapxml = '';
    $conceptmap->id = $DB->insert_record("conceptmap", $conceptmap);

    return $conceptmap->id;
}

function conceptmap_update_instance($conceptmap){

}

function conceptmap_delete_instance($id){
    global $DB;

    if (!$conceptmap = $DB->get_record('conceptmap', array('id'=>$id))) {
        return false;
    }

    $DB->delete_records('conceptmap', array('id'=>$conceptmap->id));

    return true;
}