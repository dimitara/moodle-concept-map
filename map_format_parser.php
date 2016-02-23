<?php 

/* 	----->SOMETHING USEFUL<-----
	$xml = simplexml_load_string($xml_string);
	$json = json_encode($xml);
	$array = json_decode($json,TRUE);
*/

	function from_db_to_json($conceptmap){
		$map = array();
            foreach ($conceptmap as $key => $value) {
                $type = gettype($conceptmap->$key);
                if ($key == "mapxml") {
                	$attr = $conceptmap->$key;

                	libxml_use_internal_errors(true);
				    $sxe = simplexml_load_string($attr);
				    if ($sxe === false) {
				        // echo "Failed loading the original XML\n";
				        // foreach(libxml_get_errors() as $error) {
				        //     echo "Line: $error->line($error->column) $error->message<br>";
				        // }

				        $attr = simplexml_load_string("<map>".$attr."</map>");
				    } else {
				    	$attr = simplexml_load_string($attr);
				    }


                    $map[$key] = xml_maps_to_json($attr[0]);

                    $result = json_decode($map[$key], true);
                    // super_echo($result);
                    foreach ($result as $node_key => $node_value) {
                        $map[$node_key] = $result[$node_key];               
                    }

                } else {
                	$map[$key] = $conceptmap->$key;
                }
            }
            unset($map['mapxml']);
            unset($map['timecreated']);
            unset($map['timemodified']);

            $map['id'] = $conceptmap->id;
            $map['title'] = $map['name'];
            unset($map['name']);
            foreach ($map as $key => $value) {
            	if (is_array($map[$key])) {
            		$arrays = $map[$key];
            		foreach ($arrays as $key1 => $value1) {
            			$map[$key1] = $value1;
            		}
            		unset($map[$key]);
            	}
            }

            $map_arr = check_table_format($map, $map['id'], $map['name']);
            $map = json_encode($map_arr);
            return $map;
	}

	function check_table_format($json_arr, $map_id = null, $title = null){
		$must_attributes = array('id' => $map_id, 'title' => $title, 'concepts' => [], 'relationships' => []);

		if (!empty($json_arr)) {

			foreach ($must_attributes as $key => $value) {
				if (!empty($json_arr[$key])) {
					$must_attributes[$key] = $json_arr[$key];

				}
			}
			return $must_attributes;

		} else {
			return null;
		}

	}

    function xml_maps_to_json($xml){

    	foreach ($xml as $key => $value) {
	    	// Extract the content of concepts and relationships
	    	$elements = array('concept', "relationship");
	    	$maps = array();

    		if($key == "map"){ // true if $xml is a list of maps
    			
		    	foreach ($xml as $map) {
			    	$result = clone $map;

			    	// Clear the concepts and relationships elements
			    	unset($result->concepts->concept);
			    	unset($result->relationships->relationship);

			    	// Add the concepts and relationships
			    	$json = json_encode($result);
			    	$array_map = json_decode($json, true);

					foreach ($elements as $inner_elem_array) {
			    	$main_arr = array();
						$outer_elem_array = $inner_elem_array."s";

				    	foreach ($map->$outer_elem_array->$inner_elem_array as $inner_elem_array) { //!
			    		$sub_arr = array();
				    		foreach ($inner_elem_array as $sub_key => $sub_value) { 
				    			// echo $sub_key . " -> " . $sub_value . "<br>";
				    			$sub_arr[$sub_key] = (string)$sub_value;
				    		}
				    		
			    			array_push($main_arr, $sub_arr);
				    	 }
						// super_echo($main_arr);

				    	foreach ($main_arr as $inner_arrays) {
				    		array_push($array_map[$outer_elem_array], $inner_arrays);
				    	}
						
					}
					array_push($maps, $array_map);
		    	}

    		} else { // xml is a signle map

		    	$result = clone $xml;

		    	// Clear the concepts and relationships elements
		    	unset($result->concepts->concept);
		    	unset($result->relationships->relationship);

		    	// Add the concepts and relationships
		    	$json = json_encode($result);
		    	$array_map = json_decode($json, true);

				foreach ($elements as $inner_elem_array) {
		    	$main_arr = array();
					$outer_elem_array = $inner_elem_array."s";

			    	foreach ($xml->$outer_elem_array->$inner_elem_array as $inner_elem_array) {
		    		$sub_arr = array();
			    		foreach ($inner_elem_array as $sub_key => $sub_value) { 
			    			// echo $sub_key . " -> " . $sub_value . "<br>";
			    			$sub_arr[$sub_key] = (string)$sub_value;
			    		}
			    		
		    			array_push($main_arr, $sub_arr);
			    	 }
					// super_echo($main_arr);

			    	foreach ($main_arr as $inner_arrays) {
			    		array_push($array_map[$outer_elem_array], $inner_arrays);
			    	}
					

    			}
					array_push($maps, $array_map);
    		}

	    		break;
		}
		
		if (!empty($maps)) {
			$json = json_encode($maps);
		
		} else {
			$json = json_encode(array());
		}
		return $json;
    
	}

	function json_arr_to_xml($json_arr){

		$xml_map = simplexml_load_string("<map></map>");

		foreach ($json_arr as $key => $value) {
			
			if (is_array($value)) {
				
				// keys can be array of "concepts" or "relationships"
				$xml_map->addChild($key);
				
				foreach ($value as $arrays) {

					if ($key == "concepts") {
						$node = $xml_map->$key->addChild("concept");
					
					} elseif($key == "relationships") {
						$node = $xml_map->$key->addChild("relationship");
					}

					foreach ($arrays as $sub_key => $sub_value) {
						$node->addChild($sub_key, $sub_value);
					}
				}

			} else {
				// keys can be "title" or "id" 
				$xml_map->addChild($key, $value);
			}

		}

		return $xml_map;
    }


	function xml_adopt($root, $new) {
	    $node = $root->addChild($new->getName(), (string) $new);
	    foreach($new->attributes() as $attr => $value) {
		        $node->addAttribute($attr, $value);
	    }
	    foreach($new->children() as $ch) {
	        xml_adopt($node, $ch);
	    }
	}


	function xml_to_string($xml){
		$string = $xml->asXML();
		$tag = '<?xml version="1.0"?>';
		$string = str_replace($tag, '', $string);
		return $string;
	}

	function format_xml($string){
		libxml_use_internal_errors(true);
	    $sxe = simplexml_load_string($string);
	    if ($sxe === false) {
	        // echo "Failed loading the original XML\n";
	        // foreach(libxml_get_errors() as $error) {
	        //     echo "Line: $error->line($error->column) $error->message<br>";
	        // }

	        $string = simplexml_load_string("<map>".$string."</map>");
	    }
	    return $string;
	}

	function string_to_xml($xml_string){
		$xml = simplexml_load_string($xml_string);
		return $xml;
	}


	function json_to_string($json){
		$string = json_decode($json, true);
		return $string;
	}


	function string_to_json($json_string){
		$json = json_encode($json_string);
		return $json;
	}


	function super_echo($arr){
		echo "<pre>";
		print_r($arr);
		echo "</pre>";
		echo "<hr>";

	}


?>