(function() {
    function relation(origin, target, relationLabel, relationId) {
        this.origin = origin;
        this.target = target;
        this.relationId = relationId;
        this.relationLabel = relationLabel;

        var originConcept = conceptArr.filter(function(concept) {
            return concept.conceptId === origin;
        })[0];

        var targetConcept = conceptArr.filter(function(concept) {
            return concept.conceptId === target;
        })[0];

        var originBBox = originConcept.node.node.getBBox();
        var ox = originConcept.group.getBBox().x + originBBox.width / 2;
        var oy = originConcept.group.getBBox().y + originBBox.height / 2;

        var targetBBox = targetConcept.node.node.getBBox();
        var tx = targetConcept.group.getBBox().x + targetBBox.width / 2;
        var ty = targetConcept.group.getBBox().y + targetBBox.height / 2;

        this.line = groupRelationships.line(ox, oy, tx, ty).attr({
            stroke: STROKE_COLOR,
            strokeWidth: LINE_WIDTH
        }).dblclick(dblclickRelation).hover(relHoverIn, relHoverOut);

        var lineBBox = this.line.getBBox();
        this.label = groupRelationships.text(lineBBox.cx + 4, lineBBox.cy - 4, relationLabel ? relationLabel : "new relation").dblclick(dblclicklabelText);
        var labelBBox = this.label.getBBox();
        this.label.attr({
            fill: STROKE_COLOR,
            x: lineBBox.cx - labelBBox.w / 2
        });

        function dblclicklabelText() {
            var relation = relationArr.filter(function(rel) {
                return rel.relationId === relationId;
            })[0];
            var newText = prompt("Enter labelText name", relation.label.attr('text'));
            if (newText) {


                relation.label.attr({
                    text: newText
                })
            }
        };

        function dblclickRelation() {
            var relation = relationArr.filter(function(rel) {
                return rel.relationId === relationId;
            })[0];

            if (!selRelation) {
                setRelSelection(relationId);
                relation.line.attr({
                    stroke: NODE_STROKE_SELECTED
                })
            } else if (selRelation === relationId) {
                setRelSelection(undefined);
                relation.line.attr({
                    stroke: STROKE_COLOR
                });
            }

        };

        function relHoverIn() {
            var relation = relationArr.filter(function(rel) {
                return rel.relationId === relationId;
            })[0];
            relation.line.attr({
                strokeWidth: 6,
                "stroke-opacity": 0.7
            });
        };

        function relHoverOut() {
            var relation = relationArr.filter(function(rel) {
                return rel.relationId === relationId;
            })[0];
            this.attr({
                strokeWidth: LINE_WIDTH,
                "stroke-opacity": 1
            });
        };
    }

    window.relation = relation;
}());