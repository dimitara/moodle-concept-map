(function() {
    function concept(posX, posY, labelText, conceptId) {
        this.posX = parseFloat(posX);
        this.posY = parseFloat(posY);
        this.labelText = labelText;
        this.conceptId = conceptId;
        //DRAG FUNCTIONS

        var move = function(dx, dy, absx, absy) {
            var nodeBBox = this.parent().getBBox();
            
            if(absx < 20) return ;
            if(absx > canvasWidth - 20) return ;
            
            if(absy < 50) return ;
            if(absy > canvasHeight - 20) return ;

            this.parent().attr({
                transform: this.parent().data('origTransform') + (this.parent().data('origTransform') ? "T" : "t") + [dx, dy]
            });

            var originBBox = this.getBBox();
            var ox = this.parent().getBBox().x + originBBox.width / 2;
            var oy = this.parent().getBBox().y + originBBox.height / 2;

            for (var i = 0; i < relationArr.length; i++) {
                if (relationArr[i].origin === conceptId) {
                    relationArr[i].line.attr({
                        x1: ox,
                        y1: oy
                    });


                    lineBBox = relationArr[i].line.getBBox();
                    labelBBox = relationArr[i].label.getBBox();
                    relationArr[i].label.attr({
                        x: lineBBox.cx - labelBBox.w / 2,
                        y: lineBBox.cy - 4
                    });

                }
            }

            for (var i = 0; i < relationArr.length; i++) {
                if (relationArr[i].target == conceptId) {
                    relationArr[i].line.attr({
                        x2: ox,
                        y2: oy
                    });

                    lineBBox = relationArr[i].line.getBBox();
                    labelBBox = relationArr[i].label.getBBox();
                    relationArr[i].label.attr({
                        x: lineBBox.cx - labelBBox.w / 2,
                        y: lineBBox.cy - 4
                    });

                }
            }
        }

        var start = function() {
            this.parent().data('origTransform', this.parent().transform().local);
        }

        //DOUBLE CLICK FUNCTIONS
        function dblclickNode() {
            if (selConOne == undefined && selConTwo != conceptId) {
                setSelectionOne(conceptId);
                this.attr({
                    fill: NODE_BACKGROUND,
                    stroke: NODE_STROKE_SELECTED
                });
            } else if (selConTwo == undefined && selConOne != conceptId) {
                setSelectionTwo(conceptId);
                this.attr({
                    fill: NODE_BACKGROUND
                });
                this.attr({
                    stroke: NODE_STROKE_SELECTED
                });
            } else if (selConOne == conceptId) {
                setSelectionOne(undefined);
                this.attr({
                    stroke: STROKE_COLOR,
                });
            } else if (selConTwo == conceptId) {
                setSelectionTwo(undefined);
                this.attr({
                    stroke: STROKE_COLOR
                });
            }
        };

        function dblclicklabelText() {
            var node = conceptArr.filter(function(concept) {
                return concept.conceptId === conceptId;
            })[0];

            var newText = prompt("Enter Node name", node.label.attr('text'));

            if (newText) {
                node.label.attr({
                    text: newText
                });

                var labelBBox = node.label.getBBox();

                node.node.attr({
                    'width': labelBBox.width + 50
                });
            }
        };

        function nodeHoverIn() {
            var node = conceptArr.filter(function(concept) {
                return concept.conceptId === conceptId;
            })[0];
            node.node.attr({
                "fill": HOVER_COLOR,
                "stroke-opacity": 0.7
            });
        };

        function nodeHoverOut() {
            var node = conceptArr.filter(function(concept) {
                return concept.conceptId === conceptId;
            })[0];
            node.node.attr({
                "fill": NODE_BACKGROUND,
                "stroke-opacity": 1
            });
        };

        this.group = groupNodes.group();
        this.group.attr({
            x: 0,
            y: 0
        });

        //NODE OBJECT
        this.node = this.group.rect(this.posX, this.posY, 135, 50, 10).attr({
            'fill': NODE_BACKGROUND,
            'stroke': STROKE_COLOR,
            'stroke-width': LINE_WIDTH
        }).drag(move, start).dblclick(dblclickNode).hover(nodeHoverIn, nodeHoverOut);

        //LABEL OBJECT
        this.label = this.group.text(this.posX + 25, this.posY + 28, labelText).attr({
            fill: STROKE_COLOR
        }).dblclick(dblclicklabelText);

        var labelBBox = this.label.getBBox();

        this.node.attr({
            'width': labelBBox.width + 50
        });
    }

    window.concept = concept;
}());