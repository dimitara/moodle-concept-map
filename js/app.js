(function(){
    window.onload = function(){
        setTimeout(function(){
            load();
        }, 300);
    };

    function load(){
        window.paper = Snap("#canvas");

        window.id = '';
        window.LINE_WIDTH = 3;
        window.NODE_BACKGROUND = "#fff";
        window.NODE_STROKE_SELECTED = "#60B2A4";
        window.STROKE_COLOR = "#15305D";
        window.HOVER_COLOR = "#CCD5D9";

        window.nodeDefaultX1 = 100;
        window.nodeDefaultY1 = 100;
        window.nodeDefaultX2 = 100;
        window.nodeDefaultY2 = 50;

        window.globalConceptId = 0;
        window.globalRelationId = 0;

        window.selConOne = null;
        window.selConTwo = null;
        window.selRelation = null;
        window.conceptArr = [];
        window.relationArr = [];

        window.groupRelationships = paper.group({id: 'rels'});
        window.groupNodes = paper.group({id: 'nodes'});

        window.canvasWidth = document.getElementById("canvas").width.animVal.value;
        window.canvasHeight = document.getElementById("canvas").height.animVal.value;
        window.canvasY = document.getElementById("canvas").y.animVal.value;

        window.setSelectionOne = function(value) {
            selConOne = value;
        };

        window.setSelectionTwo = function(value) {
            selConTwo = value;
        };

        window.setRelSelection = function(value) {
            selRelation = value;
        }
        window.addNode = function(posX, posY, labelText) {
            if (labelText == undefined) labelText = "New Concept";
            if (posX == undefined) posX = 10 + conceptArr.length*2;
            if (posY == undefined) posY = 10 + conceptArr.length*2;

            conceptArr[conceptArr.length] = new concept(posX, posY, labelText, ++globalConceptId);
        }

        window.deleteSelected = function(){
            if(selConOne){
                deleteConcept(selConOne);
            }

            if(selConTwo){
                deleteConcept(selConTwo);
            }

            if(selRelation){
                deleteRelation(selRelation);
            }

            selConOne = undefined;
            selConTwo = undefined;
            selRelation = undefined;
        }

        window.addRelation = function(origin, target, labelText) {
            origin = origin || selConOne; 
            target = target || selConTwo;

            if (origin == undefined || target == undefined)
                alert("Select two concepts to create a relation");
            else {
                relationArr[relationArr.length] = new relation(origin, target, labelText, ++globalRelationId);
                for (var i = 0; i < conceptArr.length; i++){
                    if (conceptArr[i].conceptId === origin){
                        conceptArr[i].node.attr({
                            stroke: STROKE_COLOR
                        });
                        selConOne = undefined;
                    }
                    else if(conceptArr[i].conceptId === target){}{
                        conceptArr[i].node.attr({
                            stroke: STROKE_COLOR
                            
                        });
                        selConTwo = undefined;
                    }
                }
            }
        }
        window.deleteConcept = function(conceptId) {
            var index = -1;
            for (var i = 0; i < conceptArr.length; i++) {
                if (conceptArr[i].conceptId === conceptId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                conceptArr[index].group.remove();
                conceptArr.splice(index, 1);
                selConOne = undefined;

                for (var i = 0; i < relationArr.length; i++) {
                    if (relationArr[i].origin == conceptId || relationArr[i].target == conceptId) {
                        relationArr[i].line.remove();
                        relationArr[i].label.remove();
                        relationArr.splice(i, 1);
                        
                        i--;
                    }
                }
            }
        };

        function deleteRelation(relationId) {
            var index = -1;
            for (var i = 0; i < relationArr.length; i++) {
                if (relationArr[i].relationId === relationId) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                relationArr[index].label.remove();
                relationArr[index].line.remove();
                relationArr.splice(index, 1);
                selRelation = undefined;
            }
        };



        window.save = function(){
            var concepts = [];
            var relationships = [];

            conceptArr.forEach(function(c){
                var bbox = c.group.getBBox();
                concepts.push({
                    id: c.conceptId,
                    label: c.label.node.innerHTML,
                    posx: bbox.x,
                    posy: bbox.y
                });
            });

            relationArr.forEach(function(r){
                relationships.push({
                    id: r.relationId,
                    label: r.label.node.innerHTML,
                    origin: r.origin,
                    target: r.target
                });
            });

            var currentMap = {
                id: id,
                concepts: concepts,
                relationships: relationships
            };

            Map.saveMap(currentMap);
        }


        function deserialize(json){
            json.id = id;
            json.concepts.forEach(function(c){
                conceptArr.push(new concept(c.posx, c.posy, c.label, c.id));
                globalConceptId++;
            });

            json.relationships.forEach(function(r){
                relationArr.push(new relation(r.origin, r.target, r.label, r.id));
                globalRelationId++;
            });
        }

        var params = location.search.replace('?', '');
        params = params.split('&');
        
        params.forEach(function(p){
            if(p.indexOf('id') > -1){
                id = p.replace('id=', '');
            }
        });

        if(id){
            Map.loadMap(id, function(data){
                deserialize(data);
            });
        }
    }
}());