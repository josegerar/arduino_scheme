/* global GlobalApisLocation, swal, store, shortcut */
app = angular.module('app', []);
app.controller('controllerWork', function ($scope, $http) {
    $scope.arrayComponentes = [];
    $scope.arrayParameters = [];
    $scope.jsonCode = [];
    $scope.ProyectoGlobalSuper = {};
    $scope.flagmultimodalx = 0;
    $scope.ListOnline = [];
    $scope.allmessages = [
//        {
//            names: "anth",
//            message: "hol",
//            date: "22:02",
//            clase: "nominubesita",
//            image: ""
//        },
//        {
//            names: "userx",
//            message: "afios",
//            date: "10:02",
//            clase: undefined,
//            image: ""
//        }
    ];

    var code;
    var editorD = "";
    var flagSock = false;


    //variables para manipular el codigo
    $scope.jsonVariables = [];
    $scope.jsonValueDigitalAnalog = [];
    $scope.jsonValueData = [];
    $scope.jsonValueDigitalRead = [];

    //cargar todos los componentes activos para ser usados por toda la aplicacion
    function getListComponents() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/getComponents',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
                    console.log(data);
                    responseA = data;
                    $scope.$apply(function () {
                        $scope.arrayComponentes = responseA;
                    });
//                    console.log(responseA);
                    loadComponents(responseA);
                },
                error: function (objXMLHttpRequest) {
                    swal.close();
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

//    function getDataSystem() {
//        $.ajax({
//            method: "POST",
//            url: "testServlet",
//            data: {option: "getDataSystem"},
//            beforeSend: function (xhr) {
//                loading();
//            },
//            success: function (data) {
//                swal.close();
//                console.log(data);
//                responseA = JSON.parse(data);
//                console.log(responseA);
//                document.getElementById("nameystem").innerHTML = responseA.data[0].nameSystem
//                document.getElementById("imgUser03").src = responseA.data[0].img
//            },
//            error: function (objXMLHttpRequest) {
//                console.log("error: ", objXMLHttpRequest);
//            }
//        });
//    }
//
//    $scope.getidjob = function () {
//        console.log("que tranza:" + $scope.ProyectoGlobalSuper.job.id_job);
//        return $scope.ProyectoGlobalSuper.job.id_job;
//    };

    $scope.enviarMsg = function () {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            let dat = new Date();
            let objectSend = {
                names: dataUser.names_user + " " + dataUser.lastname_user,
                message: $("#idmessagetext").val(),
                date: dat.getHours() + ":" + dat.getMinutes(),
                image: dataUser.img_user
            };
            MessageSend({
                header: $scope.ProyectoGlobalSuper.job.id_job,
                content: JSON.stringify(objectSend),
                config: "chat"
            });
            objectSend.clase = "minubesita";
            $scope.allmessages.push(objectSend);
        }
    };

    function updateShina(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            MessageSend({
                header: $scope.ProyectoGlobalSuper.job.id_job,
                content: JSON.stringify(obj),
                config: "codeJson"
            });
            //objectSend.clase = "minubesita";
        }
    }

    $scope.sendJsonCode = function (obj) {
        $scope.$apply(function () {
            $scope.jsonCode = JSON.parse(obj);
            updateCodeEditor();
        });
    };

    $scope.setListchat = function (obj) {
        $scope.$apply(function () {
            $scope.allmessages.push(obj);
        });
    };

    $scope.setListOnline = function (obj) {
        console.log("List; ", obj);
        $scope.$apply(function () {
            $scope.ListOnline = obj;
        });
    };


    $scope.sendModel = function () {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            if (flagSock) {
                //let dat = new Date();
                /*let objectSend = {
                 dataGraph: getModelGraph()
                 };*/
                MessageSend({
                    header: $scope.ProyectoGlobalSuper.job.id_job,
                    content: getModelSystem(),
                    config: "graph"
                });
                //objectSend.clase = "minubesita";
                //$scope.allmessages.push(objectSend);
            }
        }
    };

    $scope.getParametersBD = function (obj, objLink, objCom) {
        console.log("meteme adentro que :V");
        console.log(obj);

        //preguntamos si existen conexiones 
        if (objLink.length <= 0) {
            warningTo({information: "No programmable data available, connect the necessary ports"});
            return;
        }
        openParameters();
        $scope.arrayParameters.length = 0;

        if (obj.parameters.parameters.length > 0) {
            var index = -1;

            for (var position = 0; position < $scope.arrayComponentes.data.length; position++) {
                if ($scope.arrayComponentes.data[position].name_component === obj.name) {
                    index = position;
                    break;
                }
            }
            if (index !== -1) {
                $scope.$apply(function () {
                    //buscaremos los peurtos que estan conectados y a que componente pertenencen :3
                    for (var i = 0; i < objLink.length; i++) {
                        if (obj.key === objLink[i].from) {
                            for (var j = 0; j < $scope.arrayComponentes.data[index].dataParamsPorts.parameters.length; j++) {
                                if ($scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].port === objLink[i].fromPort) {
                                    //insertamos los puertos que se estabn usando en el diagrama, obteniendolos del arhcivo de texto
                                    $scope.arrayParameters.push({
                                        analog: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].analog,
                                        data: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].data,
                                        digital: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].digital,
                                        port: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].port,
                                        idComponent: obj.key
                                    });

                                }
                            }

                        } else if (obj.key === objLink[i].to) {
                            for (var j = 0; j < $scope.arrayComponentes.data[index].dataParamsPorts.parameters.length; j++) {
                                if ($scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].port === objLink[i].toPort) {
                                    //insertamos los puertos que se estabn usando en el diagrama, obteniendolos del arhcivo de texto
                                    $scope.arrayParameters.push({
                                        analog: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].analog,
                                        data: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].data,
                                        digital: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].digital,
                                        port: $scope.arrayComponentes.data[index].dataParamsPorts.parameters[j].port,
                                        idComponent: obj.key
                                    });

                                }
                            }
                        }
                    }
                    //$scope.arrayParameters = $scope.arrayComponentes.data[index].dataParamsPorts;
                    console.log($scope.arrayParameters);
                    document.getElementById("titleParameters").innerHTML = "#" + obj.key + " " + obj.name;
                    console.log($scope.arrayParameters);
                    if ($scope.jsonCode.length === 0) {
                        //inicializar el json que contendra todo la estructura del codigo del sistema IOT
                        $scope.jsonCode = [{
                                variables: []
                            }, {
                                pinMode: []
                            }, {
                                logic: []
                            }, {
                                params: []
                            }];

                        initCodeEditor();
                    } else {
                        updateCodeEditor();
                    }
                });
                for (var i = 0; i < $scope.arrayParameters.length; i++) {
                    if ($scope.arrayParameters[i].digital && !$scope.arrayParameters[i].analog) {
                        document.getElementById("btnDigitalAnalog" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("btnData" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("portDigital" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("statDigital" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("portAnalog" + $scope.arrayParameters[i].port).style.display = "none";
                    } else if ($scope.arrayParameters[i].analog && !$scope.arrayParameters[i].digital) {
                        document.getElementById("btnDigitalAnalog" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("btnData" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("portDigital" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("statDigital" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("portAnalog" + $scope.arrayParameters[i].port).style.display = "block";
                    } else if ($scope.arrayParameters[i].digital && $scope.arrayParameters[i].analog) {
                        document.getElementById("btnDigitalAnalog" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("btnData" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("portDigital" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("portAnalog" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("statDigital" + $scope.arrayParameters[i].port).style.display = "block";
                    }
                }
                for (var i = 0; i < $scope.arrayParameters.length; i++) {
                    if ($scope.arrayParameters[i].data) {
                        document.getElementById("btnDigitalAnalog" + $scope.arrayParameters[i].port).style.display = "none";
                        document.getElementById("btnData" + $scope.arrayParameters[i].port).style.display = "block";
                        document.getElementById("data" + $scope.arrayParameters[i].port).style.display = "block";
                    } else {
                        //document.getElementById("btnDigitalAnalog").style.display = "none";
                        //document.getElementById("btnData").style.display = "none";
                        document.getElementById("data" + $scope.arrayParameters[i].port).style.display = "none";
                    }
                }
            }
        } else {
            alert("el component no tiene parametros");
        }
    };

    //ejecutar funciones al iniciar el are de trabajo 
    $(document).ready(function () {

    });

    function loadProject() {
        if (location.search.length > 0)
        {
            let sarch = location.search.toString().replace(/\?/, "");
            console.log("search: ", sarch);
//            window.history.replaceState(null, null, "/ArudinoScheme_PI/workArea.html");
            let parts = sarch.split("&");
            console.log(parts);
            let obj = {};
            for (var index = 0; index < parts.length; index++) {
                let minpart = parts[index].toString().split("=");
                if (minpart[0] !== undefined && minpart[1] !== undefined)
                {
                    obj[minpart[0]] = minpart[1];
                }
            }
            if (obj.tk !== undefined)
            {
                loadSystem(obj);
            }
        }
    }
    
    //funcion para guardar el sistema IOT (graficos) // proximamente a guardar el json que tiene la estructura del codigo
    function saveSystem() {
        //getModelSystem();
        //JSON.stringify(getModelSystem());
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            let modelSystem = [];
            modelSystem.push({modelSystem: getModelSystem(), modelCode: getModelCode()});
            let modelText = JSON.stringify(modelSystem);
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/saveSystemTotal', //loadSystemTotal
                data: JSON.stringify({
//                    "user_token": dataUser.user_token,
                    "idSystem": $scope.ProyectoGlobalSuper.job.id_job,
                    "filepath": $scope.ProyectoGlobalSuper.job.filepath_job,
                    "dataModel": modelText
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {

                    swal.close();
//                    console.log(data);
//                    responseA = data;
                    if (data.status === 2)
                    {
                        $scope.ProyectoGlobalSuper.system = modelSystem;
                    }
                    console.log($scope.ProyectoGlobalSuper);
                    var nameProject = $("#nameystem").text();
                    if (nameProject.includes("*")) {
                        document.getElementById("nameystem").innerHTML = $scope.ProyectoGlobalSuper.job.name_job;
                    }
                    alertAll(data);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                    swal.close();
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    function getModelCode() {
        return  JSON.stringify($scope.jsonCode);
    }

    //evento click de jquey que ejecuta la funcion de guardar sistema
    $("#saveSystem").click(function () {
        saveSystem();
    });

    // funcion para hacer funcionar el guardado con la combinacion de tecla de Crtl + S
    shortcut.add("Ctrl+S", function () {
        saveSystem();
    });

    shortcut.add("Enter", function () {
        enviarMsg();
    });

    $("#viewCode").click(function () {
        openCode();
        editorD.setValue(editor.getValue());
    });

    shortcut.add("Ctrl+P", function () {
        document.getElementById("moduleCode").style.display = "block";
        editorD.setValue(editor.getValue());

    });

    //funcion para cargar el json del modelo del diagama (cargar grafico)
    function loadSystem(objectx) {

        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/loadSystemIOT', //loadSystemTotal
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "tokenidjob": objectx.tk
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    
//                console.log(data);
                    responseA = data;
                    $scope.ProyectoGlobalSuper = data.data;
                    console.log(responseA);
//                    debugger;
                    MessageSend(
                            {
                                header: data.data.job.id_job, //id de proyecto
                                content: JSON.stringify({
                                    email: dataUser.names_user + " " + dataUser.lastname_user, // email de usuario
                                    img: dataUser.img_user // imagen de usuario
                                }),
                                config: "init"
                            }
                    );
                    $("#nameystem").html(responseA.data.job.name_job);
                    getListComponents();

                    initDiagram(responseA.data);

                    initPalette();

                    initContextMenu();
                    if (responseA.data.system[0].modelCode.length > 0) {
                        $scope.jsonCode = JSON.parse(responseA.data.system[0].modelCode);
                        initCodeEditor();
                        updateCodeEditor();
                    } else {
                        initCodeEditor();
                    }
                    swal.close();
                    console.log("pp");
                    flagSock = true;
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                    swal.close();
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    // ******************** //
    // GENERACION DE CÓDIGO //
    // ******************** //

    var editor = "";
    var band = false;

    //funcion que inicializa el apartado de codigo, agregando la base para codigo arduino
    function initCodeEditor() {
        var langTools = ace.require("ace/ext/language_tools");
        var x = ace.require("require('ace/multi_select'");
        //instancia de su editor
        editor = window.CE = ace.edit("editorCode");
        if (band === false)
        {
            editor.setValue("//Create by EaCircuits \n\
void setup()\n\
{\n\
    Serial.begin(9600);\n\
}\n\
void loop()\n\
{\n\
\n\
} ");
        }
        //editor.selection.getCursor();
        // CON MODELIST ES UNA LISTA DE MODELOS (TIPO DE EXTENSIÓN)
        var modelist = ace.require("ace/ext/modelist");
        // TOMARÁ EL TIPO DE ARCHIVO EN ESTE CASO LE PUSIMOS .C
        var filePath = "archive.C";
        // dependiendo que extensión es la ruta, selecciona el tipo de modelo
        var mode = modelist.getModeForPath(filePath).mode;
        // imprime el modelo
        console.log(mode);
        // tema
        editor.setTheme("ace/theme/chrome");
        // establece el lenguaje de programación
        editor.session.setMode(mode);
        editor.setShowPrintMargin(false);
        editor.setReadOnly(true);
        initCodeDownload();
    }

    //funcion para inicilalizar el modulo de codigo grande
    function initCodeDownload() {
        var langTools = ace.require("ace/ext/language_tools");
        var x = ace.require("require('ace/multi_select'");
        //instancia de su editor
        editorD = window.CE = ace.edit("editorCodeDownload");
        var modelist = ace.require("ace/ext/modelist");
        // TOMARÁ EL TIPO DE ARCHIVO EN ESTE CASO LE PUSIMOS .C
        var filePath = "archive.C";
        // dependiendo que extensión es la ruta, selecciona el tipo de modelo
        var mode = modelist.getModeForPath(filePath).mode;
        // imprime el modelo
        console.log(mode);
        // tema
        editorD.setTheme("ace/theme/chrome");
        // establece el lenguaje de programación
        editorD.session.setMode(mode);
        editorD.setShowPrintMargin(false);
        editorD.setReadOnly(true);
    }

    //funcion que actualiazara el codigo por cualqueir modificacion que se valla realizando
    function updateCodeEditor() {
        code = "";
        editor.setValue(code);
        code += "//Create by EaCircuits \n";
        //actualizamos los cambios realizados en el json de las variables
        //$scope.jsonCode[1].pinMode = $scope.jsonValueDigitalAnalog;
        console.log("scope: ", $scope);
        if ($scope.jsonCode.length > 0) {
            for (var indexVariables = 0; indexVariables < $scope.jsonCode[0].variables.length; indexVariables++) {
                code += $scope.jsonCode[0].variables[indexVariables].type + " " + $scope.jsonCode[0].variables[indexVariables].var + ";\n";
            }
        }
        code += "\n";
        code += "void setup () \n";
        code += "{ \n";
        code += "    Serial.begin(9600); \n";

        if ($scope.jsonCode.length > 1) {
            for (var indexVariables = 0; indexVariables < $scope.jsonCode[1].pinMode.length; indexVariables++) {
                code += "    " + $scope.jsonCode[1].pinMode[indexVariables].pinModePort + "\n";
            }
        }

        if ($scope.jsonCode.length > 1) {
            for (var indexVariables = 0; indexVariables < $scope.jsonCode[0].variables.length; indexVariables++) {
                code += "    " + $scope.jsonCode[0].variables[indexVariables].var + " = " + $scope.jsonCode[0].variables[indexVariables].value + ";\n";
            }
        }

        code += "}\n";
        code += "void loop() \n\
            {\n";

        if ($scope.jsonCode.length > 1) {
            for (var indexVariables = 0; indexVariables < $scope.jsonCode[1].pinMode.length; indexVariables++) {
                if ($scope.jsonCode[1].pinMode[indexVariables].out_inp === true) {
                    code += "    " + $scope.jsonCode[1].pinMode[indexVariables].valueWriteRaad + "\n";
                }
            }
        }

        if ($scope.jsonCode.length > 2) {
            code += analize($scope.jsonCode[2].logic, 1);
        }

        code += "}";
        editor.setValue(code);

        console.log(code);
        //function para inicializar los tooltip de los componentes de boostrap
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    // funcion para agregar las variables a usar en el sistema IOT dependiendo de la logica del usuario
    $scope.setVariables = function () {
        addVariables({
            var : $("#nameVar").val(),
            type: $("#typeVar").val(),
            value: $("#valueVar").val().trim() !== "" ? $("#valueVar").val() : $("#selectSerial").val() !== "---" ? $("#selectSerial").val() : $("#selectPorts").val() !== "---" ? $("#selectPorts").val() : alert("esta mal algo :v")
        });
        //actualizamos el codigo 
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };
    
   $scope.deletePort = function (position) {
        $scope.jsonCode[0].variables.splice(position, 1);
        console.log(position);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    // funcion para ser llamada desde el scope de angular
    function addVariables(obj) {
        $scope.jsonCode[0].variables.push({
            var : obj.var,
            type: obj.type,
            value: obj.value
        });
        console.log($scope.jsonVariables);
        updateShina($scope.jsonCode);
    }

    //agrear los puertos que estan siendo usados por el arduino
    $scope.addPortsDigitalAnalog = function (position) {
        //alert("digital o analogico");

        //alert($("#selectPD" + $scope.arrayParameters[position].port).val());

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() !== "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() !== "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() !== "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() === "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() === "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() !== "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        if ($("#selectPD" + $scope.arrayParameters[position].port).val() === "---" &&
                $("#selectSD" + $scope.arrayParameters[position].port).val() !== "---" &&
                $("#selectPA" + $scope.arrayParameters[position].port).val() === "---") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        //$scope.jsonValueDigitalRead.length = 0;

        if ($scope.arrayParameters[position].digital === true && $scope.arrayParameters[position].analog === false) {
            if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                    $("#selectSD" + $scope.arrayParameters[position].port).val() !== "---" &&
                    $("#selectPD" + $scope.arrayParameters[position].port).val() === "digitalWrite") {
                $scope.jsonCode[1].pinMode.push({
                    valueWriteRaad: $("#selectPD" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ", " +
                            $("#selectSD" + $scope.arrayParameters[position].port).val() + ");",
                    pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",OUTPUT);",
                    namePort: $scope.arrayParameters[position].port,
                    out_inp: true
                });
            } else {
                $scope.jsonCode[1].pinMode.push({
                    valueWriteRaad: $("#selectPD" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ")",
                    pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",INPUT);",
                    namePort: $scope.arrayParameters[position].port,
                    out_inp: false

                });
            }
        } else {
            if ($("#selectPD" + $scope.arrayParameters[position].port).val() === "---" &&
                    $("#selectSD" + $scope.arrayParameters[position].port).val() === "---" &&
                    $("#selectPA" + $scope.arrayParameters[position].port).val() !== "---" &&
                    $("#selectPA" + $scope.arrayParameters[position].port).val() === "analogWrite") {
                $scope.jsonCode[1].pinMode.push({
                    valueWriteRaad: $("#selectPA" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ",255);",
                    pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",OUTPUT);",
                    namePort: $scope.arrayParameters[position].port,
                    out_inp: true
                });
            } else {

                if ($("#selectPD" + $scope.arrayParameters[position].port).val() !== "---" &&
                        $("#selectSD" + $scope.arrayParameters[position].port).val() !== "---" &&
                        $("#selectPA" + $scope.arrayParameters[position].port).val() === "---" &&
                        $("#selectPD" + $scope.arrayParameters[position].port).val() === "digitalWrite") {
                    $scope.jsonCode[1].pinMode.push({
                        valueWriteRaad: $("#selectPD" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ", " +
                                $("#selectSD" + $scope.arrayParameters[position].port).val() + ");",
                        pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",OUTPUT);",
                        namePort: $scope.arrayParameters[position].port,
                        out_inp: true
                    });

                    console.log($scope.jsonCode[1].pinMode);
                    updateShina($scope.jsonCode);
                    updateCodeEditor();
                    return;
                } else {
                    $scope.jsonCode[1].pinMode.push({
                        valueWriteRaad: $("#selectPA" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ")",
                        pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",INPUT);",
                        namePort: $scope.arrayParameters[position].port,
                        out_inp: false
                    });
                    console.log($scope.jsonCode[1].pinMode);
                    updateShina($scope.jsonCode);
                    updateCodeEditor();
                    return;
                }

                $scope.jsonCode[1].pinMode.push({
                    valueWriteRaad: $("#selectPA" + $scope.arrayParameters[position].port).val() + "(" + $scope.arrayParameters[position].port + ")",
                    pinModePort: "pinMode(" + $scope.arrayParameters[position].port + ",INPUT);",
                    namePort: $scope.arrayParameters[position].port,
                    out_inp: false
                });
            }
        }

        console.log($scope.jsonValueDigitalRead);
        console.log($scope.jsonCode[1].pinMode);
        updateShina($scope.jsonCode);
        updateCodeEditor();
    };

    //agregar los value de los parametros de los componentes que no son puertos digitales ni analogicos si no que solo transfieren datos
    $scope.addValueData = function (position) {
        //alert("datito");
        $scope.jsonCode[3].params.push({
            namePort: $scope.arrayParameters[position].port,
            valueParam: $("#input" + $scope.arrayParameters[position].port).val(),
            idComponent: $scope.arrayParameters[position].idComponent
        });
        updateShina($scope.jsonCode);
    };

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectVariables_a").change(function () {
        if ($("#selectVariables_a").val() !== "---") {
            $("#selectPorts_a").prop("disabled", true);
            $("#selectParams_a").prop("disabled", true);
        } else {
            $("#selectPorts_a").prop("disabled", false);
            $("#selectParams_a").prop("disabled", false);
        }
    });

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectVariables_b").change(function () {
        if ($("#selectVariables_b").val() !== "---") {
            $("#selectPorts_b").prop("disabled", true);
            $("#selectParams_b").prop("disabled", true);
        } else {
            $("#selectPorts_b").prop("disabled", false);
            $("#selectParams_b").prop("disabled", false);
        }
    });

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectPorts_a").change(function () {
        if ($("#selectPorts_a").val() !== "---") {
            $("#selectParams_a").prop("disabled", true);
            $("#selectVariables_a").prop("disabled", true);
        } else {
            $("#selectParams_a").prop("disabled", false);
            $("#selectVariables_a").prop("disabled", false);
        }
    });

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectPorts_b").change(function () {
        if ($("#selectPorts_b").val() !== "---") {
            $("#selectParams_b").prop("disabled", true);
            $("#selectVariables_b").prop("disabled", true);
        } else {
            $("#selectParams_b").prop("disabled", false);
            $("#selectVariables_b").prop("disabled", false);
        }
    });

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectParams_a").change(function () {
        if ($("#selectParams_a").val() !== "---") {
            $("#selectVariables_a").prop("disabled", true);
            $("#selectPorts_a").prop("disabled", true);
        } else {
            $("#selectVariables_a").prop("disabled", false);
            $("#selectPorts_a").prop("disabled", false);
        }
    });

    //evento click del select de variables para que los demas select se deshabiliten
    $("#selectParams_b").change(function () {
        if ($("#selectParams_b").val() !== "---") {
            $("#selectVariables_b").prop("disabled", true);
            $("#selectPorts_b").prop("disabled", true);
        } else {
            $("#selectVariables_b").prop("disabled", false);
            $("#selectPorts_b").prop("disabled", false);
        }
    });

    //evento para habilitar mas items .. 
    $("#selectSerialIfPrint").change(function () {
        if ($("#selectSerialIfPrint").val() !== "Serial.format") {
            $("#selectFomatIf").prop('disabled', true);
            //$("#valueSerialIf").prop('disabled', true);
        } else {
            if ($("#selectSerialIfPrint").val() === "---") {
                $("#selectFomatIf").prop('disabled', true);
                $("#valueSerialIf").prop('disabled', true);
            } else {
                $("#selectFomatIf").prop('disabled', false);
                $("#valueSerialIf").prop('disabled', false);
            }
        }
    });

    //evento para habilitar las opciones
    $("#selectSerialIf").change(function () {
        if ($("#selectSerialIf").val() !== "---") {
            $("#selectPortsiF").prop('disabled', true);
            $("#valueVarIf").prop('disabled', true);
        } else {
            $("#selectPortsiF").prop('disabled', false);
            $("#valueVarIf").prop('disabled', false);
        }
    });

    //evento change para habilitar las opciones disponibles cuando se seleccione las opciones de los puertos 
    $("#selectPortsiF").change(function () {
        if ($("#selectPortsiF").val() !== "---") {
            $("#selectSerialIf").prop('disabled', true);
            $("#valueVarIf").prop('disabled', true);
        } else {
            $("#selectSerialIf").prop('disabled', false);
            $("#valueVarIf").prop('disabled', false);
        }
    });


    //funcion para validar los datos que se ingresar al momento de hacer dentro de un if o de un else
    function validateDo() {
        if ($("#nameVarIf").val() === "" && $("#typeVarIf").val() === "---" && $("#selectSerialIf").val() === "---" && $("#selectPortsiF").val() === "---" &&
                $("#valueVarIf").val() === "" && $("#selectSerialIf").val() === "---" && $("#selecrFomatIf").val() === "---" && $("#selectPorts").val() === "---" &&
                $("#valueSerialIf").val() === "") {
            errorTo({information: "Error when processing the data"});
            return;
        }

        //validar que se va agregar en el else .. y que se pueda concatenar mas info si se dea :v duerme
        //variables
        let nameVar = $("#nameVarIf").val();
        let typeData = $("#typeVarIf").val() !== "---" ? $("#typeVarIf").val() : "";
        let value = $("#selectSerialIf").val() !== "---" ? $("#selectSerialIf").val() : $("#selectPortsiF").val() !== "---" ? $("#selectPortsiF").val() : $("#valueVarIf").val() !== "---" ? $("#valueVarIf").val() : "";


        //print
        let valueSeriales = $("#selectSerialIfPrint").val() !== "---" ? $("#selectSerialIfPrint").val() : "";
        let format = $("#selectFomatIf").val() !== "---" ? $("#selectFomatIf").val() : "";
        let variable = $("selectVariablesIf").val() !== "---" ? $("#selectVariablesIf").val() : "";
        let valuePrint = $("#valueSerialIf").val().trim() !== "" ? $("#valueSerialIf").val() : "";

        let variableFinal;
        let printFinal;

        if (typeData !== "" && nameVar !== "" && value !== "") {
            variableFinal = typeData === "string" ? typeData + " " + nameVar + ";\n" + nameVar + " = '" + value + "';\n" : typeData + " " + nameVar + ";\n" + nameVar + " = " + value + ";\n";
        } else {
            variableFinal = "";
        }

        if (valueSeriales !== "" && format !== "" && variable !== "" || valuePrint !== "") {
            printFinal = valueSeriales === "Serial.format" ? "Serial.format(" + variable + ", " + format + ");\n" : valueSeriales + "('" + valuePrint + "' + " + variable + ");\n";
        } else {
            printFinal = "";
        }

        return variableFinal + printFinal;

    }

    //funcion para validar el ingreso de las condiciones de los IF
    // 0 para agrear una nueva condicion, 1 para editar un if existente
    function validateIf(option) {
        if (option === 0) {
            if ($("#selectVariables_a").val() === "---" && $("#selectOperation").val() === "---" && $("#selectVariables_b").val() === "---" &&
                    $("#selectPorts_a").val() === "---" && $("#selectParams_a").val() === "---" && $("#selectPorts_b").val() === "---" &&
                    $("#selectParams_b").val() === "---") {
                errorTo({information: "Error when processing the data"});
                return;
            }

            let condition_one = $("#selectVariables_a").val() !== "---" ? $("#selectVariables_a").val() : $("#selectPorts_a").val() !== "---" ? $("#selectPorts_a").val() :
                    $("#selectParams_a").val() !== "---" ? $("#selectParams_a").val() : '';
            let operation = $("#selectOperation").val() !== "---" ? $("#selectOperation").val() : '';
            let condition_two = $("#selectVariables_b").val() !== "---" ? $("#selectVariables_b").val() : $("#selectPorts_b").val() !== "---" ? $("#selectPorts_b").val() :
                    $("#selectParams_b").val() !== "---" ? $("#selectParams_b").val() : '';

            return condition_one + " " + operation + " " + condition_two + " ";
        } else {
            let condition_one = $("#selectVariables_a").val() !== "---" ? $("#selectVariables_a").val() : $("#selectPorts_a").val() !== "---" ? $("#selectPorts_a").val() :
                    $("#selectParams_a").val() !== "---" ? $("#selectParams_a").val() : '';
            let operation = $("#selectOperation").val() !== "---" ? $("#selectOperation").val() : '';
            let condition_two = $("#selectVariables_b").val() !== "---" ? $("#selectVariables_b").val() : $("#selectPorts_b").val() !== "---" ? $("#selectPorts_b").val() :
                    $("#selectParams_b").val() !== "---" ? $("#selectParams_b").val() : '';

            if (condition_one === '' && condition_two === '' && operation !== '') {
                let operationLogic = operation !== ">" && operation !== ">=" && operation !== "<" && operation !== "<=" && operation !== "==" ? operation : '';

                if (operationLogic !== '') {
                    return operationLogic + ' ';
                } else {
                    errorTo({information: "Error when processing the data"});
                }
            } else {
                if (condition_one !== '' && condition_two !== '' && operation !== '') {
                    return condition_one + ' ' + operation + ' ' + condition_two;
                } else {
                    errorTo({information: "Error when processing the data"});
                }
            }
        }
    }

    //funcion para agregar las condiciones en los if en los if nuevos
    $scope.addCondition = function () {
     console.log($("#selectOperation option:selected").text());
        if($("#selectOperation option:selected").text()!==("---"))
        {
            $scope.jsonCode[2].logic.push({
            "do": "",
            "if": validateIf(0),
            "doif": [],
            "else": []
        });
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    }
        
        
    };

    //agregar nuevas condicionesa  un if seleccionado
    $scope.updateIf = function (position) {
        $scope.jsonCode[2].logic[position].if += validateIf(1);
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar lo que se hara despues del if
    $scope.addDoIf = function (position) {
        if ($scope.jsonCode[2].logic[position].doif.length > 0) {
            $scope.jsonCode[2].logic[position].doif[0].do += validateDo();
        } else {
            $scope.jsonCode[2].logic[position].doif.push({
                "do": validateDo(),
                "if": "",
                "doif": [],
                "else": []
            });
        }
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar un else en el 1er if
    $scope.addElse = function (position) {
        if ($scope.jsonCode[2].logic[position].else.length > 0) {
            $scope.jsonCode[2].logic[position].else[0].do += validateDo();
        } else {
            $scope.jsonCode[2].logic[position].else.push({
                "do": validateDo(),
                "if": "",
                "doif": [],
                "else": []
            });
        }
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar new if dentro de otro if
    $scope.addNewIf = function (position) {
        $scope.jsonCode[2].logic[position].doif.push({
            "do": "",
            "if": validateIf(0),
            "doif": [],
            "else": []
        });
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar un nuevo if dentro del primer else
    $scope.elseAddNewIf = function (position) {
        if ($scope.jsonCode[2].logic[position].else.length > 0 && $scope.jsonCode[2].logic[position].else[0].if === "") {
            $scope.jsonCode[2].logic[position].else[0].if = validateIf(0);
        } else {
            $scope.jsonCode[2].logic[position].else.push({
                "do": "",
                "if": validateIf(0),
                "doif": [],
                "else": []
            });
        }
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar un nuevo if dentro del primer else
    $scope.elseAddNewIf_A = function (obj) {
        if (obj.else.length > 0 && obj.else[0].if === "") {
            obj.else[0].if = validateIf(0);
        } else {
            obj.else.push({
                "do": "",
                "if": validateIf(0),
                "doif": [],
                "else": []
            });
        }
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    //agregar do a cualquier nuevo if que se este agregando
    $scope.addDoIf_A = function (obj) {
        if (obj.doif.length > 0) {
            obj.doif[0].do += validateDo();
        } else {
            obj.doif.push({
                "do": validateDo(),
                "if": "",
                "doif": [],
                "else": []
            });
            console.log($scope.jsonCode[2].logic);
            updateCodeEditor();
            updateShina($scope.jsonCode);
        }
    };

    //agregar si se desa un else
    $scope.addElse_A = function (obj) {
        obj.else.push({
            "do": validateDo(),
            "if": "",
            "doif": [],
            "else": []
        });
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    $scope.addNewIf_A = function (obj) {
        obj.doif.push({
            "do": "",
            "if": validateIf(0),
            "doif": [],
            "else": []
        });
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };

    $scope.updateIf_A = function (obj) {
        obj.if += validateIf(1);
        console.log($scope.jsonCode[2].logic);
        updateCodeEditor();
        updateShina($scope.jsonCode);
    };


    //funcion para obtener en que nivel de la recursividad se encunetra el codigo y aplicar tabulacion 
    function getIdenta(num)
    {
        return "\t".repeat(num);
    }

    function analize(object, level) {
        let superStruct = "";
        if (object.length > 0)
        {
            for (var i = 0; i < object.length; i++) {
                superStruct += analizeObject(object[i], level);
                superStruct += ((object.length > 1 && i < object.length - 1) ? "\n" : "");
            }
        }
        return superStruct;
    }
    function analizeObject(object, level) {
        let dox = object['do'];//plain code
        dox = ((dox.length > 0 && dox !== undefined) ? (getIdenta(level) + dox) : "");
        let ifx = object['if'];// plain code
        ifx = ((ifx.length > 0 && ifx !== undefined) ? ("\n" + getIdenta(level) + "if(" + ifx + ")\n") : "");
        let doifx = "";
        let elsex = "";
        if (ifx.length > 0 && ifx !== undefined)
        {
            doifx = analize(object['doif'], level + 1);//recursive
            doifx = ((doifx.length > 0 && doifx !== undefined) ? (getIdenta(level) + "{\n" + doifx + "\n" + getIdenta(level) + "}") : "");
            elsex = analize(object['else'], level + 1);//recursive
            elsex = ((elsex.length > 0 && elsex !== undefined) ? ("\n" + getIdenta(level) + "else\n" + getIdenta(level) + "{\n" + elsex + "\n" + getIdenta(level) + "}\n") : "");
        }
        return dox + ifx + doifx + elsex;
    }


    //descargar codido en un fichero
    $("#btnDownload").click(function () {
        this.href = 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(editorD.getValue());
    });

    $("#downloadCode").click(function () {
        this.href = 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(editorD.getValue());
    });
    
    loadProject();

});
