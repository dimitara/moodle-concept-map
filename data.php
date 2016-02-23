<?php
define('AJAX_SCRIPT', true);
require('../../config.php');
require_once('lib.php');
include_once('map_format_parser.php');


$table = 'conceptmap';
$map_id = $_GET['id'];
$error = '';

if (!$cm = get_coursemodule_from_id('conceptmap', $map_id)) {
    $error = 'Course Module ID was incorrect';
}
if (!$course = $DB->get_record('course', array('id'=> $cm->course))) {
    $error = 'Course is misconfigured';
}
if (!$conceptmap = $DB->get_record($table, array('id'=> $cm->instance))) {
    $error = 'Course module is incorrect';
}


try {
    //require_login();
    //require_sesskey();
    header('Content-Type: text/plain; charset=utf-8');
    $id = $conceptmap->id;
    $title = $conceptmap->name;
    
    $request_type = $_SERVER['REQUEST_METHOD'];

    switch($request_type) {
        case 'GET':
            $map = from_db_to_json($conceptmap);
            $map = json_decode($map, true);
            // echo $map['id'];
            if($map['id'] != null){
                deliver_response("Map retrieving successful", $map);

            } else {
                deliver_response("Map not found");
            }

            break;

        case 'PUT':
            $json_string = file_get_contents('php://input');
            $json_arr = json_decode($json_string, true);

            $conceptmap->mapxml = "";

            if (empty($conceptmap->mapxml)) { // updating empty record with whole map
                $mapxml = json_arr_to_xml($json_arr);
                $mapxml = xml_to_string($mapxml);
            } else { // updating only the differences

                // $mapxml = format_xml($conceptmap->mapxml);
                // $mapxml = xml_maps_to_json($mapxml);
                // $mapxml = json_decode($mapxml, true)[0];

                // foreach ($mapxml as $key => $value) {
                //     if (!empty($json_arr[$key])) {
                //         $mapxml[$key] = $json_arr[$key];
                //     }
                // }
            }
            
            $conceptmap->mapxml = $mapxml;

            $DB->update_record($table, $conceptmap, $bulk=false);
            // super_echo($conceptmap); // result as XML
            $map = from_db_to_json($conceptmap);
            $map = json_decode($map, true);
            deliver_response("The map has been updated", $map);

            break;

        // case 'DELETE':
        //     echo "It is a DELETE request";
        //     $DB->delete_records($table, array('id'=> $id));
        //     break;

        default:
            break;
    }

} catch (Exception $e) {
    header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
    if (isloggedin()) {
        header('Content-Type: text/plain; charset=utf-8');
        echo $e->getMessage();
    }   
}

function deliver_response($message=null, $map_as_arr=null){

        $result['messaage'] = $message;
        if ($map_as_arr != null) {
            $result['map'] = $map_as_arr;
        }

        $map = json_encode($result);
        echo $map;
}