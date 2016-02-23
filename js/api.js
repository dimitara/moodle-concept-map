//TODO: handle scenario where concept with relationships is deleted by deleting all related relationships

(function () {
    'use strict';

    var apiAdress = '', //the address of the API server
        currentMap = {}, // object holding current loaded map
        list = [];
    //generates and returns unuqie id for concept/relationship
    //objectlist should be either currentMap.concepts or currentMap.relationships 
    function generateID(objectList) {
        var maxId = 0,
            item;
        for (var i = 0, length = objectList.length; i < length; i += 1) {

            if (maxId < objectList[i].id) {
                maxId = objectList[i].id;
            }
        }
        return maxId + 1;
    }

    function loadMap(mapID, successCallback) {
        YUI().use("io-base", function (Y) {
            var uri = apiAdress + 'data.php?id=' + mapID;

            // Define a function to handle the response data            
            function success(id,o, args){
                var data = o.responseText; // Response data.
                currentMap = JSON.parse(data).map;
                successCallback(currentMap);
            }
            Y.on('io:success', success, Y, ['lorem', 'noMap']);
            var request = Y.io(uri);
        });
    }

    function addConcept(label, posx, posy) {
        var id = generateID(currentMap['concepts']);

        currentMap.concepts.push({
            "label": label,
            "posx": posx,
            "posy": posy,
            "id": id
        });
    }

    function addRelationship(label, source, target) {
        var id = generateID(currentMap.relationships);

        currentMap.relationships.push({
            "label": label,
            "source": source,
            "target": target
        });
    }

    function updateConcept(id, label, posx, posy) {
        var i = 0,
            length = currentMap.concepts.length;
        for (; i < length; i += 1) {
            if (currentMap.concepts[i].id == id) {
                currentMap.concepts[i].label = label;
                currentMap.concepts[i].posx = posx;
                currentMap.concepts[i].posy = posy;
            }
        }

    }

    function updateRelationship(id, label, source, target) {
        var i = 0,
            length = currentMap.relationships.length;
        for (; i < length; i += 1) {
            if (currentMap.relationships[i].id == id) {
                currentMap.relationships[i].label = label;
                currentMap.relationships[i].source = source;
                currentMap.relationships[i].target = target;
            }
        }


    }

    function deleteConcept(id) {
        var i,
            length = currentMap.concepts.length;
        for (i = 0; i < length; i += 1) {
            if (currentMap.concepts[i].id == id) {
                currentMap.concepts.splice(i, 1);
                break;
            }
        }
    }

    function deleteRelationship(id) {
        var i,
            length = currentMap.relationships.length;
        for (i = 0; i < length; i += 1) {
            if (currentMap.relationships[i].id == id) {
                currentMap.relationships.splice(i, 1);
                break;
            }
        }
    }

    function createMap(title) {
        var requestResponse;
        YUI().use('io-xdr', function (Y) {
            var uri = apiAdress + "data.php",
                json = {
                    "title": title
                },
                cfg = {
                    xdr: {
                      use : 'native'  
                    },
                    method: 'POST',
                    data: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    on: {

                        success: function (id, response) {
                            requestResponse = response.responseText;
                            alert("Map is saved successfully");
                        }
                    }
                };
            Y.io.header("X-Requested-With");
            var request = Y.io(uri, cfg);
        });

        currentMap = JSON.parse(requestResponse).map;
    }

    function saveMap(currentMap) {
        var requestResponse;
        YUI().use('io-base', function (Y) {
            var uri = apiAdress + "data.php?id=" + currentMap.id,
                json = {
                    "id": currentMap.id,
                    "concepts": currentMap.concepts,
                    "relationships": currentMap.relationships
                },
                cfg = {
                    method: 'PUT',
                    data: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    on: {

                        success: function (id, response) {
                            requestResponse = response.responseText;
                            alert("Map is saved successfully");
                        }
                    }
                };
            var request = Y.io(uri, cfg);
        });
    }

    function deleteMap(id) {
        var requestResponse;
        YUI().use('io-base', function (Y) {
            var uri = apiAdress + "data.php?id=" + id,
                cfg = {
                    method: 'DELETE',
                    on: {

                        success: function (id, response) {
                            requestResponse = response.responseText;
                        }
                    }
                };
            var request = Y.io(uri, cfg);
        });
    }

    function mapsList(successCallback) {
        YUI().use("io-base", function (Y) {
            var uri = apiAdress + 'data.php';

            // Define a function to handle the response data.
            function success(id, o, args) {

                var data = o.responseText; // Response data.
                list = JSON.parse(data).mapsList;
                successCallback(list);

            }
            
            Y.on('io:success', success, Y, ['lorem', 'noList']);
            var request = Y.io(uri);
        });
    }
    window.Map = {
        createMap: createMap,
        saveMap: saveMap,
        loadMapList: mapsList,
        deleteMap: deleteMap,
        loadMap: loadMap,
        currentMap: function () {
            return currentMap;
        },
        currentList: function () {
            return list;
        },
        addRelationship: addRelationship,
        addConcept: addConcept,
        deleteConcept: deleteConcept,
        deleteRelationship: deleteRelationship,
        updateConcept: updateConcept,
        updateRelationship: updateRelationship

    };

}());