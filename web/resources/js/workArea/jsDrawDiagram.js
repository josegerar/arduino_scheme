/* global go */

var myDiagram;
var myPalette;
var goJs;
var nodeMenu;
var lineMenu;
var objpos = [];

//function para inicializar los tooltip de los componentes de boostrap
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//function SpotLinkingTool() {
//    go.LinkingTool.call(this);
//}
//go.Diagram.inherit(SpotLinkingTool, go.LinkingTool);

function insertLink(fromnode, fromport, tonode, toport) {
    var link = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
    if (link !== null) {
        var port;
        if (this.isForwards) {
            port = toport;
        } else {
            port = fromport;
        }
        var portb = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
                port.getDocumentPoint(go.Spot.BottomRight));
        var lp = link.getLinkPointFromPoint(port.part, port, port.getDocumentPoint(go.Spot.Center),
                this.diagram.lastInput.documentPoint, !this.isForwards);
        var spot = new go.Spot((lp.x - portb.x) / (portb.width || 1), (lp.y - portb.y) / (portb.height || 1));
        if (this.isForwards) {
            link.toSpot = spot;
        } else {
            link.fromSpot = spot;
        }
    }
    return link;
}

//function SpotRelinkingTool() {
//    go.RelinkingTool.call(this);
//}
//go.Diagram.inherit(SpotRelinkingTool, go.RelinkingTool);

function  reconnectLink(link, newnode, newport, toend) {
    go.RelinkingTool.prototype.reconnectLink.call(this, link, newnode, newport, toend);
    if (link !== null) {
        var port = newport;
        var portb = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
                port.getDocumentPoint(go.Spot.BottomRight));
        var lp = link.getLinkPointFromPoint(port.part, port, port.getDocumentPoint(go.Spot.Center),
                this.diagram.lastInput.documentPoint, !toend);
        var spot = new go.Spot((lp.x - portb.x) / (portb.width || 1), (lp.y - portb.y) / (portb.height || 1));
        if (toend) {
            link.toSpot = spot;
        } else {
            link.fromSpot = spot;
        }
    }
    return link;
}

//Inicializar el diagrama 
function initDiagram(json) {
    // diagram.isReadOnly = true; // solo lectura
    goJs = go.GraphObject.make;
    myDiagram = goJs(go.Diagram, "lienzo", {
        padding: 20,
        allowCopy: false,
//        linkingTool: SpotLinkingTool,
//          relinkingTool: SpotRelinkingTool,
        "animationManager.isEnabled": false,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        //initialAutoScale: go.Diagram.Uniform,
        //initialContentAlignment: go.Spot.Center,
        // override the link creation process
//        "relinkingTool.reconnectLink": function (link, newnode, newport, toend) {
//            go.RelinkingTool.prototype.reconnectLink.call(this, link, newnode, newport, toend);
//            if (link !== null) {
//                var port = newport;
//                var portb = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
//                        port.getDocumentPoint(go.Spot.BottomRight));
//                var lp = link.getLinkPointFromPoint(port.part, port, port.getDocumentPoint(go.Spot.Center),
//                        this.diagram.lastInput.documentPoint, !toend);
//                var spot = new go.Spot((lp.x - portb.x) / (portb.width || 1), (lp.y - portb.y) / (portb.height || 1));
//                console.log(spot);
//                if (toend) {
//                    link.toSpot = spot;
//                } else {
//                    link.fromSpot = spot;
//                }
//            }
//            return link;
//        },
        "linkingTool.insertLink": function (fromnode, fromport, tonode, toport) {
            var link = go.LinkingTool.prototype.insertLink.call(this, fromnode, fromport, tonode, toport);
            if (link !== null) {
                var port;
                if (this.isForwards) {
                    port = toport;
                } else {
                    port = fromport;
                }
                var portb = new go.Rect(port.getDocumentPoint(go.Spot.TopLeft),
                        port.getDocumentPoint(go.Spot.BottomRight));
                var lp = link.getLinkPointFromPoint(port.part, port, port.getDocumentPoint(go.Spot.Center),
                        this.diagram.lastInput.documentPoint, !this.isForwards);
                var spot = new go.Spot((lp.x - portb.x) / (portb.width || 1), (lp.y - portb.y) / (portb.height || 1));
                spot.F > spot.G ? (spot.F = spot.F / 2) : (spot.G = spot.G / 2);
                //var spot = new go.Spot(1, 1);
                console.log({link: link, newspot: spot, lp: lp, newport: portb, tospot: link.toSpot, fromspot: link.fromSpot});
                if (this.isForwards) {
                    link.toSpot = spot;
                } else {
                    link.fromSpot = spot;
                }
            }
            return link;
        },
        scale: 0.5, // extra space when scrolled all the way
        grid: goJs(go.Panel, "Grid", // a simple 10x10 grid
                goJs(go.Shape, "LineH", {stroke: "lightgray", strokeWidth: 0.5}),
                goJs(go.Shape, "LineV", {stroke: "lightgray", strokeWidth: 0.5})
                )});
    myDiagram.layoutDiagram(false);
    //diagram.toolManager.linkingTool.insertLink = insertLink;
    //diagram.toolManager.relinkingTool.reconnectLink = reconnectLink;
    //myDiagram.layout = new go.GridLayout();
    //myDiagram.layout.isInitial = false;
    //myDiagram.layout.isOngoing  = false;

    // install custom linking tool, defined in PolylineLinkingTool.js
    /*var tool = new PolylineLinkingTool();
     //tool.temporaryLink.routing = go.Link.Orthogonal;  // optional, but need to keep link template in sync, below
     myDiagram.toolManager.linkingTool = tool;*/


    nodeMenu =
            goJs("ContextMenu",
                    itemButton("Parameters",
                            function (e, obj) {
                                e.diagram.commandHandler.copySelection();
                                console.log(obj.part.data);
                                console.log(myDiagram.model.linkDataArray);
                                angular.element($('[ng-controller="controllerWork"]')).scope().getParametersBD(obj.part.data, myDiagram.model.linkDataArray,
                                        myDiagram.model.nodeDataArray);
                            }),
                    itemButton("Delete",
                            function (e, obj) {
                                e.diagram.commandHandler.deleteSelection();
                            }),
                    goJs(go.Shape, "LineH", {strokeWidth: 2, height: 1, stretch: go.GraphObject.Horizontal}),
                    itemButton("More Info...",
                            function (e, obj) {
                                alert("mas info :v");
                            })
                    );

    lineMenu =
            goJs("ContextMenu",
                    itemButton("Delete",
                            function (e, obj) {
                                e.diagram.commandHandler.deleteSelection();
                            }),
                    itemButton("Change Color",
                            function (e, obj) {
                                alert("aun no xd");
                            })
                    );
    //new go.Point(100,-60);
    myDiagram.nodeTemplate =
            goJs(go.Node, "Spot", new go.Binding("position", "positionComponent"),
                    goJs(go.Panel, "Auto",
                            goJs(go.Picture,
                                    new go.Binding("source", "img"), {
                                contextMenu: nodeMenu,
                                mouseEnter: function (e, obj) {
                                    //alert(obj.part.data.key);
                                    document.getElementById("nameComponentKey").innerHTML = "#" + obj.part.data.key + " " + obj.part.data.name;
                                    if (objpos.length === 0) {
                                        //agregamos un nuevo item
                                        objpos.push({
                                            id: obj.part.data.key,
                                            position: obj.part.position
                                        });
                                    } else {
                                        for (var i = 0; i < objpos.length; i++) {
                                            if (obj.part.data.key === objpos[i].id) {
                                                objpos[i].position = obj.part.position;
                                                return;
                                            }
                                        }
                                        // si no exite ninguno que ya este agreagado entonces se crea un nuevo item
                                        objpos.push({
                                            id: obj.part.data.key,
                                            position: obj.part.position
                                        })
                                    }
                                    console.log(objpos);

                                },
                                /*mouseEnter: function (e, obj) {
                                 console.log(obj.part);
                                 console.log(obj.part.position);
                                 //objpos = obj.part.position;
                                 },*/
                            }
                            ),
                            ),
                    goJs(go.Panel, go.Panel.Position,
                            new go.Binding("itemArray", "rectanglePorst"),
                            {
                                itemTemplate:
                                        goJs(go.Panel, go.Panel.Position,
                                                goJs(go.Panel, "Horizontal",
                                                        new go.Binding("itemArray", "ports"),
                                                        new go.Binding("desiredSize", "size"),
                                                        new go.Binding("position", "position"),
                                                        new go.Binding("background", "background"),
                                                        new go.Binding("portId", "portId"),
                                                        {
                                                            itemTemplate:
                                                                    goJs(go.Panel,
                                                                            {
                                                                                portId: "",
                                                                                //fromSpot: go.Spot.AllSides, toSpot: go.Spot.AllSides,
                                                                                //locationSpot: go.Spot.Center,
                                                                                fromLinkable: true, toLinkable: true,
                                                                                toLinkableDuplicates: true,
                                                                                fromLinkableDuplicates: true,
                                                                                toLinkableSelfNode: true,
                                                                                fromLinkableSelfNode: true,
                                                                                toMaxLinks: 1,
                                                                                fromMaxLinks: 1,
                                                                                alignment: go.Spot.Default

                                                                            }, new go.Binding("portId", "portId"),
                                                                            goJs(go.Shape, {
                                                                                fill: "transparent",
                                                                                stroke: null,
                                                                                cursor: "pointer",
                                                                                margin: new go.Margin(0, 0, 0, 0),
                                                                                mouseEnter: function (e, port) {
                                                                                    if (!e.diagram.isReadOnly)
                                                                                        port.fill = "red";
                                                                                },
                                                                                mouseLeave: function (e, port) {
                                                                                    port.fill = "transparent";
                                                                                }
                                                                            },
                                                                                    new go.Binding("fill", "color"),
                                                                                    new go.Binding("margin", "margin"),
                                                                                    new go.Binding("figure", "figure"),
                                                                                    new go.Binding("desiredSize", "sizePort")
                                                                                    ),
                                                                            {// this tooltip shows the name and picture of the kitten
                                                                                toolTip:
                                                                                        goJs("ToolTip",
                                                                                                goJs(go.Panel, "Vertical",
                                                                                                        goJs(go.TextBlock, {margin: 3, font: "11px Nunito, Serif"},
                                                                                                                new go.Binding("text", "tool"))
                                                                                                        )
                                                                                                )  // end Adornment
                                                                            }
                                                                    )
                                                        }
                                                )
                                                )
                            }
                    ),
                    );


    myDiagram.linkTemplate =
            goJs(go.Link,
                    {
                        contextMenu: lineMenu,
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        reshapable: true,
                        resegmentable: true,
                        relinkableFrom: true, relinkableTo: true,
                        selectionAdorned: true,
                        mouseEnter: function (e, link) {
                            link.elt(0).stroke = "rgba(140, 0, 50)";
                        },
                        mouseLeave: function (e, link) {
                            link.elt(0).stroke = "transparent";
                        }
                    },
                    //{ routing: go.Link.Orthogonal },  // optional, but need to keep LinkingTool.temporaryLink in sync, above
                    //{adjusting: go.Link.Stretch}, // optional
                    new go.Binding("points").makeTwoWay(),
                    //goJs(go.Shape, { strokeWidth: 1.5 }),
                    //goJs(go.Shape, {toArrow: "OpenTriangle"}),
                    goJs(go.Shape, {isPanelMain: true, stroke: "transparent", strokeWidth: 10}),
                    goJs(go.Shape, {isPanelMain: true, stroke: "rgba(140, 0, 50)", strokeWidth: 8}));
    /*goJs(go.Link,
     {
     //routing: go.Link.AvoidsNodes,
     //corner: 0,
     //curve: go.Link.JumpGap,
     //reshapable: true,
     //resegmentable: true,
     //relinkableFrom: true,
     //relinkableTo: true,
     //routing: go.Link.Orthogonal,
     selectionAdorned: true,
     layerName: "Foreground",
     reshapable: true,
     routing: go.Link.AvoidsNodes,
     corner: 5,
     curve: go.Link.JumpOver,
     contextMenu: lineMenu,
     relinkableFrom: true, relinkableTo: true,
     mouseEnter: function (e, link) {
     link.elt(0).stroke = "rgba(140, 0, 50)";
     },
     mouseLeave: function (e, link) {
     link.elt(0).stroke = "transparent";
     }
     }, new go.Binding("points").makeTwoWay(),
     goJs(go.Shape, {isPanelMain: true, stroke: "transparent", strokeWidth: 10}),
     goJs(go.Shape, {isPanelMain: true, stroke: "rgba(140, 0, 50)", strokeWidth: 8})
     );*/

    //VALIDACION DE LA CONEXION A LOS PUERTOS
    /*myDiagram.toolManager.relinkingTool.linkValidation = function (fromnode, fromport, tonode, toport, link) {
     console.log(fromport.jb.portId);
     console.log(toport.jb.portId);
     //alert("desde: " + fromport.data.key + "hasta: " +toport.data.key);
     //return fromport.jb.portId === "Gnd";
     }*/

    myDiagram.model =
            goJs(go.GraphLinksModel,
                    {linkFromPortIdProperty: "fromPort", // información requerida: 
                        linkToPortIdProperty: "toPort", // identifica los nombres de propiedad de datos 
                        nodeDataArray: [
                            //
                        ], linkDataArray: [
                            // no hay enlaces predeclarados 
                        ]});

    goJs(go.Overview, "overView", {
        observed: myDiagram
    });

    myDiagram.undoManager.isEnabled = true;
    myDiagram.toolManager.draggingTool.isGridSnapEnabled = true;
    myDiagram.grid.gridCellSize = new go.Size(20, 20);
    myDiagram.toolManager.toolTipDuration = 5000;

    console.log(myDiagram.model.nodeDataArray);

    myDiagram.mouseDrop = function (e) {
        //console.log(myDiagram.model.part)
//        console.log(myDiagram.selection);
//        console.log(myDiagram.model.nodeDataArray);
//        console.log(myDiagram.model.nodeDataArray[myDiagram.model.nodeDataArray.length - 1]);
//        angular.element($('[ng-controller="controllerWork"]')).scope().sendModel();
    };
//    console.log(json);
//    debugger;
    if (Object.keys(json.system[0].modelSystem).length > 0) {
        myDiagram.model = go.Model.fromJson(json.system[0].modelSystem);
        //return;
    }


    myDiagram.model.addChangedListener(function (e) {
        if (e.isTransactionFinished) {
            var tx = e.object;
            if (tx instanceof go.Transaction && window.console) {
                var nameProject = $("#nameystem").text();
                console.log(nameProject);
                if (!nameProject.includes("*")) {
                    document.getElementById("nameystem").innerHTML += "*";
                }
                angular.element($('[ng-controller="controllerWork"]')).scope().sendModel();
                window.console.log(tx.toString());
                tx.changes.each(function (c) {
                    // consider which ChangedEvents to record
//                    if (c.model) {
//                        var nameProject = $("#nameystem").text();
//                        console.log(nameProject);
//                        if (!nameProject.includes("*")) {
//                            document.getElementById("nameystem").innerHTML += "*";
//                        }
//                        angular.element($('[ng-controller="controllerWork"]')).scope().sendModel();
//                        console.log(myDiagram.model.linkDataArray);
//                        window.console.log("  " + c.toString());
//                    }
                });
            }
        }
    });

    console.log(myDiagram.model.nodeDataArray);
}

//Inicializar el menu contextual
function itemButton(text, action, flag) {
    return goJs("ContextMenuButton",
            goJs(go.TextBlock, text),
            {click: action},
            flag ? new go.Binding("visible", "", function (o, e) {
                return o.diagram ? flag(o, e) : false;
            }).ofObject() : {});
}

function initContextMenu() {
    myDiagram.contextMenu = goJs("ContextMenu",
            itemButton("Paste",
                    function (e, obj) {
                        e.diagram.commandHandler.pasteSelection(e.diagram.toolManager.contextMenuTool.mouseDownPoint);
                    },
                    function (o) {
                        return o.diagram.commandHandler.canPasteSelection(o.diagram.toolManager.contextMenuTool.mouseDownPoint);
                    }),
            itemButton("Undo",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
            itemButton("Redo",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    })
            );
}

//Inicializar la paleta de los componentes
function initPalette() {
    myPalette = goJs(go.Palette, "myPalette",
            {// customize the GridLayout to align the centers of the locationObjects
                layout: goJs(go.GridLayout, {alignment: go.GridLayout.Location})
            });

    myPalette.nodeTemplate =
            goJs(go.Node, "Horizontal",
                    {locationObjectName: "TB", locationSpot: go.Spot.Center},
                    goJs(go.Panel, "Auto", {width: 65, height: 100, margin: new go.Margin(0, 5, 0, 20), cursor: "pointer"},
                            goJs(go.Picture,
                                    new go.Binding("source", "img"),
                                    new go.Binding("width", "widthX"),
                                    new go.Binding("height", "heightX"),
                                    {imageAlignment: go.Spot.Center, margin: new go.Margin(10, 0, 0, 0)

                                    },
                                    ),
                            ),
                    goJs(go.Panel, "Auto", {width: 160, height: 100},
                            goJs(go.TextBlock, {name: "TB"},
                                    new go.Binding("text", "name"), {
                                font: "bold  14px Nunito, Serif"
                            }),
                            goJs(go.TextBlock, {name: "TB"},
                                    new go.Binding("text", "description"), {
                                margin: new go.Margin(0, 20, 0, 0, ),
                                font: "11px Nunito, Serif"
                            })
                            ),
                    );

}

//Cargar los datos de los componentes(funcion que debe servir para el webSocket)
function loadComponents(obj) {
    console.log(myDiagram.model);
    console.log(obj);
    let components = [];
    let dataPorts = {
        size: "",
        ports: [{
                color: "yellow",
                figure: "Ellipse",
                sizePort: "",
                margin: ""
            }]
    };

    for (var i = 0; i < obj.data.length; i++) {
        switch (obj.data[i].name_component) {
            case "Arduino Uno":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(20, 20);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsArduinoUno(dataPorts),
                    widthX: 100,
                    heightX: 50
                });
                break;

            case "Protoboard":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Ellipse";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsProhoboard(dataPorts),
                    widthX: 100,
                    heightX: 50
                });
                break;

            case "Sensor ultrasónico":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsUltrasonicSensor(),
                    widthX: 55,
                    heightX: 35
                });
                break;

            case "HC-05-male":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsHC05Male(),
                    widthX: 55,
                    heightX: 35
                });
                break;

            case "LCD":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsLCD(),
                    widthX: 55,
                    heightX: 35
                });
                break;

            case "ESP-8266 Module":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsESP8266Module(),
                    widthX: 55,
                    heightX: 35
                });
                break;
            case "Pir Sensor":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsSesor(),
                    widthX: 55,
                    heightX: 35
                });
                break;
            case "LM34":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsLM34(),
                    widthX: 55,
                    heightX: 55
                });

                break;
            case "LM34x":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsLM34X(),
                    widthX: 55,
                    heightX: 35
                });
                break;
            case "Led blue":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsLedBlue(),
                    widthX: 20,
                    heightX: 55
                });

                break;
            case "RHT03":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsRHT03(),
                    widthX: 30,
                    heightX: 55
                });

                break;
            case "Speaker":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsSpeacker(),
                    widthX: 55,
                    heightX: 70
                });
                break;
            case "Giroscopy":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsGiroscopy(),
                    widthX: 30,
                    heightX: 55
                });

                break;
            case "Potenciometer":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsPotenciometer(),
                    widthX: 30,
                    heightX: 35
                });

                break;
            case "PushButton":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsPushButton(),
                    widthX: 30,
                    heightX: 35
                });

                break;
            case "LUX Sensor":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: creatPortsLuxSensor(),
                    widthX: 40,
                    heightX: 40
                });

                break;
            case "LM 390":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsLM390(),
                    widthX: 55,
                    heightX: 30
                });

                break;
            case "Resistor":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsResistor(),
                    widthX: 55,
                    heightX: 20
                });
                break;
            case "MCU v9":

                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsMCUv9(),
                    widthX: 55,
                    heightX: 40
                });

                break;

            case "Sensor MQ-135":
                dataPorts.size = new go.Size(956, 20);
                dataPorts.ports[0].figure = "Rectangle";
                dataPorts.ports[0].sizePort = new go.Size(11, 11);
                dataPorts.ports[0].margin = new go.Margin(0, 9, 0, 10);

                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsMQ135(),
                    widthX: 55,
                    heightX: 70
                });
                break;
            default :
                components.push({
                    key: obj.data[i].id_com,
                    img: obj.data[i].pathimg_component,
                    name: obj.data[i].name_component,
                    description: obj.data[i].description_component,
                    positionComponent: "",
                    parameters: obj.data[i].dataParamsPorts,
                    rectanglePorst: createPortsDinamic(obj.data[i].dataParamsPorts),
                    widthX: 55,
                    heightX: 60
                });
                console.log(obj.data[i].dataParamsPorts);
                break;
        }

        /* Parametros para obtener los componentes ingresados desde la aplicacion */

    }
    //console.log(components);
    setComponents(components);
}

//mostrar los componentes el la paleta cargados desde la BD
function setComponents(obj) {
    myPalette.model = new go.GraphLinksModel(obj);
    //myDiagram.model.addNodeData(obj);
    console.log(obj);
}

//funcion para obtener los datos de los componentes seleccionados y conocer sus parametros
function getParameters(obj) {
    openParameters();
    document.getElementById("titleParameters").innerHTML = "Parameters - " + obj.name;
    console.log(obj.parameters.parameters);



}

//funcion para abrir la ventana de los parametros
function openParameters() {
    $('#moduleParam').removeClass("animate__animated animate__fadeOutDownBig divParameters").addClass("animate__animated animate__fadeInUpBig divParameters");
    document.getElementById("moduleParam").style.display = "block";
}

//funcion para cerrar a ventana de los parametros
function closeParameters() {
    $('#moduleParam').removeClass("animate__animated animate__fadeInUpBig divParameters").addClass("animate__animated animate__fadeOutDownBig divParameters");
    document.getElementById("moduleParam").style.display = "none";
}


//funcion para abrir la ventana del codigo
function openCode() {
    document.getElementById("moduleCode").style.display = "block";
}

$("#closeCode").click(function () {
    document.getElementById("moduleCode").style.display = "none";
});

$(document).ready(function () {
    //initDiagram();
    //initPalette();
    //initContextMenu();
});

function getModelSystem() {

    //poner posiciones actualizadas
    console.log(myDiagram.model.nodeDataArray);
    if (objpos.length > 0) {
        for (var i = 0; i < objpos.length; i++) {
            for (var j = 0; j < myDiagram.model.nodeDataArray.length; j++) {
                if (myDiagram.model.nodeDataArray[j].key === objpos[i].id) {
                    myDiagram.model.nodeDataArray[j].positionComponent = objpos[i].position;
                }
            }
        }
    }

    console.log(myDiagram.model.toJson());
    return myDiagram.model.toJson();
}

$("#exportPNG").click(function () {
    let img = myDiagram.makeImageData({scale: 1, background: "white", type: "image/png"});
    console.log(img.split(',')[1]);
    return img.split(',')[1];
});

/* SOCKET PARA LOS GRAFICOS */

function updateSystem(obj) {
    myDiagram.model = go.Model.fromJson(obj);
    myDiagram.layoutDiagram(false);
}

function sendJsonCode(obj) {
    angular.element($('[ng-controller="controllerWork"]')).scope().sendJsonCode(obj);
}

function getModelGraph() {
    console.log(myDiagram.model.toJson());
    return myDiagram.model.toJson();
}


//app = angular.module('app', []);
//app.factory('controllerWork', function ($rootScope) {
//
//
//});




