/* global GlobalApisLocation */

/**
 * @file This page contains variables and methods used to display and manage the components.
 * @author DÚVAL CARVAJA, JORGE MOLINA, ANTHONY PACHAY
 * @see <a href="jsComponents.html">jsComponents</a>
 */

/** @namespace jsComponents
 * @description This file contains a set of methods that are of global interest to the application.
 */

/**@class angular_module.Module:app
 * @memberOf angular_module
 * @description declare the modulo to use angular js [angular.module('app', [])]
 * @example jsComponents
 * app = angular.module('app');
 * @example
 * <html ng-app="app"></html>
 */
app = angular.module('app', []);
/**
 * @class angular_module.Module:app.Controller:MyCtrl
 * @memberOf jsComponents
 * @description Defines the Controller to be used in the html.
 * @param {$scope} $scope Is a JavaScript object that basically links the "controller" and the "view". One can define member variables in the scope within the controller that can then be accessed by the view.
 * @param {$http} $http Is a core AngularJS service that is used to communicate with the remote HTTP service via browser’s XMLHttpRequest object or via JSONP
 * @example
 * app.controller('MyCtrl', function ($scope, $http) {
 *  //Here is the application code.
 * });
 * @example
 * <div ng-controller="MyCtrl"></div>
 */
app.controller('controllerComponents', function ($scope, $http) {
    /**
     * @property {ArrayJsonObject} $scope.total Json-type object container array representing the components to be displayed.
     * @memberOf jsComponents
     * @example
     * $scope.total[n];
     */
    $scope.total = [];
    /**
     * @property {ArrayJsonObject} $scope.arrayComponentsActive Json-type object container array representing the components Actives to be displayed.
     * @memberOf angular_module.Module:app.Controller:MyCtrl
     * @example
     * $scope.arrayComponentsActive[n];
     */
    $scope.arrayComponentsActive = [];
    $scope.arrayComponentsInactive = [];
    $scope.arrayParameters = [];
    $scope.arrayPorts = [];
    $scope.dataSession = [];

    var canvasF = document.getElementById("canvas_buffer");
    var canvasS = document.getElementById("canvas_buffer1");
    var inputfile = document.getElementById("imgcargada")
            , lienzo = canvasS.getContext("2d")
            , DataLienzo = canvasS.getBoundingClientRect();
    var maximH = 0;
    var maximW = 0;
    var img;
    var dataRotation = {};
    var puntos = [];

    $scope.addParam = function () {
        $scope.arrayParameters.push({
            param: $("#param_new").val()
        });
    };

    /**
     * @function deleteParam
     * @memberOf angular_module.Module:app.Controller:MyCtrl
     * @instance
     * @description This function allows you to delete a parameter from the component you are working with.
     * @param {position} position Represents the index of an item selected from the list of available objects in the $scope.arrayParameters array.
     * @example
     * $scope.deleteParam(1);
     * @example
     * <button ng-click="deleteParam($index)"></button>
     */
    $scope.deleteParam = function (position) {
        $scope.arrayParameters.splice(position, 1);
        console.log($scope.arrayParameters);
    };
    $scope.addPorts = function () {
        $scope.arrayPorts.push({
            port: $("#port_new").val()
        });
        
    };
    $scope.deletePort = function (position) {
        $scope.arrayPorts.splice(position, 1);
        console.log($scope.arrayPorts);
    };

    function getComponentsActive() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/getComponentesActive',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                console.log(data);
                    var responseJson = data;
                    console.log(responseJson);
                    $scope.$apply(function () {
                        $scope.arrayComponentsActive = responseJson.data;
                        responseJson.tittle = "Get Components Active";
                        if (responseJson.status === 2) {
                            alertAll(responseJson);
                        } else {
                            alertAll(responseJson);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    function getComponentsInctive() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/getComponentsInactive',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Get Components Inactive.";
                    console.log(responseJson);
                    $scope.$apply(function () {
                        $scope.arrayComponentsInactive = responseJson.data;
                        if (responseJson.status === 2) {
                            alertAll(responseJson);
                        } else {
                            alertAll(responseJson);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    function getComponentesTotal() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/getComponentsTotal',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (datax) {
                    swal.close();
//                    console.log(datax);
                    var responseJsonx = datax;
                    responseJsonx.tittle = "Get Components Total.";
                    console.log(responseJsonx);
                    $scope.$apply(function () {
                        $scope.total = responseJsonx.data;
                        if (responseJsonx.status === 2) {
                            alertAll(responseJsonx);
                        } else {
                            alertAll(responseJsonx);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    $scope.viewDetails = function (objectViewer) {
        console.log(objectViewer);
        document.getElementById("modalDuvcaDetails").style.display = "block";
        document.getElementById("imgDetailPropio").src = objectViewer.pathimg_component;
        document.getElementById("nameProductDetails").innerHTML = objectViewer.name_component;
        document.getElementById("descriptionProductDetails").innerHTML = objectViewer.description_component;
        document.getElementById("userProduct").innerHTML = objectViewer.users_id_user;
    };
    $("#closeModalDuvca").click(function () {
        document.getElementById("modalDuvcaDetails").style.display = "none";
    });
    $(document).ready(function () {
        getDataSession();
        getComponentsActive();
        getComponentesTotal();
//        getComponentsInctive();
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            if (dataUser.type_user === "Administrator") {
                document.getElementById("unconfirmedComponent").style.display = "none";
            } else {
                getComponentsInctive();
                document.getElementById("unconfirmedComponent").style.display = "block";
            }
        }

    });

    $("#saveComponent").click(function () {
        $.when(createFromData(canvasF.toDataURL("image/png"), 'imgComponent')).done(function (component) {
            saveComponent({
                nameComponent: $("#componentName_new").val(),
                descriptionComponent: $("#description_new").val(),
                pathImgComponent: component
            });
        });
    });

    $("#cancelComponent").click(function () {
        document.getElementById("formComponent").style.display = "none";
        document.getElementById("tableComponentDiv").style.display = "block";
        clearComponents();

    });

    async function createFromData(ImageURL, flag) {
        // Split the base64 string in data and contentType
        var block = ImageURL.split(";");
        // Get the content type
        var contentType = block[0].split(":")[1];// In this case "image/gif"
        // get the real base64 content of the file
        var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

        // Convert to blob
        var blob = b64toBlob(realData, contentType);
        let file = new File([blob], "somename", {lastModified: new Date().getTime(), type: blob.type});


        let urlCloud = 'https://api.cloudinary.com/v1_1/dhgrt80hq/image/upload';
        let passwordCloud = (flag === 'usr') ? 'eausers' : 'vkisculu';
        let formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', passwordCloud);
        // Enviar a cloudianry
        let response = await axios.post(
                urlCloud,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
        );
        console.log("F");
        console.log(response.data.secure_url.toString());
        return response.data.secure_url.toString();
    }

    /***
     * @description oye ese man
     * @param {type} b64Data
     * @param {type} contentType
     * @param {type} sliceSize
     * @returns {Blob}
     */
    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }


    function saveComponent(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            let jsonParamPorts = {
                parameters: $scope.arrayPorts,
                code: $("#codeComponent_new").val()
            };
            console.log(jsonParamPorts);
            console.log(JSON.stringify(jsonParamPorts));
            let status = '-A';
            if (dataUser.type_user === "Administrator") {
                status = 'A';
            } else {
                status = 'I';
            }

            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/saveComponent',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    nameComponent: obj.nameComponent,
                    descriptionComponent: obj.descriptionComponent,
                    activeComponent: status,
                    pathImgComponent: obj.pathImgComponent,
                    dataPorts: JSON.stringify(jsonParamPorts)
                }),
                beforeSend: function (data) {
                    loading();
                },
                success: function (datax) {
                    swal.close();
                    console.log(datax);
                    var responseJsonx = datax;
                    console.log(responseJsonx);
                    $scope.$apply(function () {
                        $scope.total = responseJsonx.data;
                        if (responseJsonx.status === 2) {
                            document.getElementById("formComponent").style.display = "none";
                            document.getElementById("tableComponentDiv").style.display = "block";
                            clearComponents();
                            getComponentsInctive();
                            successTo(responseJsonx);
                        } else {
                            successTo(responseJsonx);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        } else {
            location.href = "login.html";
        }

    }

    $("#btnSaveComponent").click(function () {
        pathImg("btnimgp_new");
    });
    $("#btnNewComponent").click(function () {
        document.getElementById("formComponent").style.display = "block";
        document.getElementById("tableComponentDiv").style.display = "none";
    });

    function visualizarImagen(fileM, idImg)
    {
        if (fileM.size <= 5000500)
        {
            let imgrial = document.getElementById(idImg);
            let fReader = new FileReader();
            fReader.readAsDataURL(fileM);
            fReader.onloadend = function (event) {
                let img = new Image();
                img.src = event.target.result;
                imgrial.src = event.target.result;
                img.onload = function () {
                    calcularTamanio(img, imgrial, 250);
                    imgrial.className = "intense";
                    Intense(imgrial);
                };
                console.log(img.src);
            };
            fReader = undefined;
            console.log(fReader);
        } else {
            alertAll({status: 4, information: "The image exceeds 5 mb."});
        }
    }

    function calcularTamanio(img, imgrial, max)
    {
        let porcentaje;
        if (img.height > img.width)
        {
            porcentaje = escalar(img.height, max, 10, 0);
        } else
        {
            porcentaje = escalar(img.width, max, 10, 0);
        }
        imgrial.height = (img.height * porcentaje) / 100;
        imgrial.width = (img.width * porcentaje) / 100;
    }
    function escalar(h, limit, unit, mount)
    {
        if (unit < 0.0001)
        {
            return mount;
        }
        let flag = true, i = 0, val = 0;
        while (flag && i < 1000) {
            if ((h * (mount + (i * unit)) / 100) <= limit && h * ((mount + ((i + 1) * unit)) / 100) > limit)
            {
                val = (i * unit);
                flag = false;
            }
            i++;
        }
        return escalar(h, limit, unit / 10, mount + val);
    }

    document.getElementById("imgDetailPropio").onload = function () {
        let imgrial = document.getElementById("imgDetailPropio");
        Intense(imgrial);

        let img = document.createElement("img");
        img.src = imgrial.src;
        img.onload = function () {
            calcularTamanio(img, imgrial, 440);
        };
    };
    function onChange() {
        $("body").niceScroll({
            cursorcolor: "#0099BC",
            cursorborderradius: "15px"
        });
    }

    /* PUERTOS PARA LAS IMAGENES */

    $("#btnSaveParameter").click(function () {
        addParameters({
            port: $("#namePort").val(),
            digital: $("#typeDigital").prop("checked") ? true : false,
            analog: $("#typeDigital").prop("checked") ? true : false,
            data: $("#typeDigital").prop("checked") ? true : false,
            posx: $("#posX").val(),
            posy: $("#posY").val(),
            energy: $("#typeEnergy").prop("checked") ? true : false,
            min: $("#miniumV").val(),
            max: $("#maximumV").val()
        });
        $("#modalDataPort").modal("hide");
    });

    $("#typeEnergy").click(function () {
        if ($("#typeEnergy").prop("checked")) {
            //alert("seleccionado");
            $("#miniumV").prop("disabled", false);
            $("#maximumV").prop("disabled", false);
            $("#miniumV").val("");
            $("#maximumV").val("");
        } else {
            $("#miniumV").prop("disabled", true);
            $("#maximumV").prop("disabled", true);
            $("#miniumV").val("");
            $("#maximumV").val("");
        }
    });

    function addParameters(obj) {
        $scope.$apply(function () {
            $scope.arrayPorts.push({
                port: obj.port,
                digital: obj.digital,
                analog: obj.analog,
                data: obj.data,
                posx: parseFloat(obj.posx),
                posy: parseFloat(obj.posy),
                energy: obj.energy,
                min: obj.min,
                max: obj.max
            });
        });
        console.log($scope.arrayPorts);
    }

    inputfile.addEventListener("change", function () {
        let fReader = new FileReader();
        fReader.readAsDataURL(inputfile.files[0]);
        fReader.onloadend = function (event) {
            img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                calcularTamanio(img);
                canvasS.width = img.width;
                canvasS.height = img.height;
                canvasF.width = img.width;
                canvasF.height = img.height;
                dataimg = {h: img.height, w: img.width};
                console.log("go");
                canvasF.getContext("2d").drawImage(img, 0, 0, img.width, img.height);

                dataRotation = {
                    key: 0,
                    config: [
                        {k: 0, angle: 0, x: 0, y: 0},
                        {k: 1, angle: (Math.PI / 2) * 1, x: 0, y: -canvasF.height},
                        {k: 2, angle: (Math.PI / 2) * 2, x: -canvasF.width, y: -canvasF.height},
                        {k: 3, angle: (Math.PI / 2) * 3, x: -canvasF.width, y: 0}
                    ]
                };
//                        canvasF.getContext('2d').rotate((Math.PI / 2)*3);
//                canvasF.getContext("2d").drawImage(img, -249,
//                        0, dataimg.w, dataimg.h);
            };
            console.log(img.src);

        };
    });
    document.getElementById("puntosx").addEventListener("click", function () {
        console.log(puntos);
        console.log(canvasF.toDataURL("image/png"));
    });
    canvasS.addEventListener("mousemove", function (evt) {
//                if (canvasS.pusheable === true)
//                {

        if (puntos[canvasS.keypuntito] !== undefined)
        {
            //canvasS.getContext("2d").fillStyle = "white";
            //lienzo.fillRect(puntos[canvasS.keypuntito].x, puntos[canvasS.keypuntito].y, puntos[canvasS.keypuntito].w, puntos[canvasS.keypuntito].w);
            lienzo.clearRect(puntos[canvasS.keypuntito].x, puntos[canvasS.keypuntito].y, puntos[canvasS.keypuntito].w, puntos[canvasS.keypuntito].w);
            let mousePos = oMousePos(evt);
            let locationpuntito = canvasS.locationpuntito !== undefined ? canvasS.locationpuntito : {x: 0, y: 0};
//                    console.log(locationpuntito.x);
            puntos[canvasS.keypuntito].x = (mousePos.x - locationpuntito.x);
            puntos[canvasS.keypuntito].y = (mousePos.y - locationpuntito.y);
//                    puntos[canvasS.keypuntito].x = mousePos.x;
//                    puntos[canvasS.keypuntito].y = mousePos.y; 

            canvasS.getContext("2d").fillStyle = "green";
            lienzo.fillRect(puntos[canvasS.keypuntito].x, puntos[canvasS.keypuntito].y, puntos[canvasS.keypuntito].w, puntos[canvasS.keypuntito].w);
            for (let index = 0; index < puntos.length; index++) {
                let flag = ChocanPines(puntos[canvasS.keypuntito], puntos[index]);
                if (flag && canvasS.keypuntito !== index)
                {
                    console.log("rozó");
                    canvasS.getContext("2d").fillStyle = "red";
                    lienzo.fillRect(puntos[index].x, puntos[index].y, puntos[index].w, puntos[index].w);
                    canvasS.getContext("2d").fillStyle = "green";
                }
            }
        }
//                    console.log(mousePos);
//                }
//                marcarCoords(output, mousePos.x, mousePos.y)
    }, false);

    canvasS.addEventListener("mousedown", function (evt) {
        if (!document.getElementById("rotarL").disabled)
        {
            document.getElementById("rotarL").disabled = true;
            document.getElementById("rotarR").disabled = true;
        }

        var mousePos = oMousePos(evt);
        console.log("down");
//                canvasS.pusheable = true;
        let find = false;
        for (var index = 0; index < puntos.length; index++) {
            if (Entra(mousePos.x, mousePos.y, puntos[index]) && !find)
            {
                find = true;
                console.log("punto seleccionado");
                canvasS.keypuntito = index;
                // here
                canvasS.locationpuntito = {x: mousePos.x - puntos[index].x, y: mousePos.y - puntos[index].y}
                canvasS.getContext("2d").fillStyle = "green";
                lienzo.fillRect(puntos[index].x, puntos[index].y, puntos[index].w, puntos[index].w);
            }
        }


        if (find === false)
        {
            let puntito = {
                id: (puntos.length <= 0) ? 0 : (puntos[puntos.length - 1].id + 1),
                x: mousePos.x,
                y: mousePos.y,
                w: 20
            };
            canvasS.getContext("2d").fillStyle = "red";
            puntos.push(puntito);
            lienzo.fillRect(puntito.x, puntito.y, puntito.w, puntito.w);
            console.log("creando nuevo punto");
        }
    }, false);

    canvasS.addEventListener("dblclick", function (evt) {
        $("#modalDataPort").modal();
        var mousePos = oMousePos(evt);
        console.log(canvasS.locationpuntito);
        for (var index = 0; index < puntos.length; index++) {
            if (Entra(mousePos.x, mousePos.y, puntos[index]))
            {
                if ($scope.arrayPorts.length > 0) {
                    for (var i = 0; i < $scope.arrayPorts.length; i++) {
                        if (puntos[index].x === $scope.arrayPorts[i].posx && puntos[index].y === $scope.arrayPorts[i].posy) {
                            $("#namePort").val($scope.arrayPorts[i].port);
                            $("#posX").val($scope.arrayPorts[i].posy);
                            $("#posY").val($scope.arrayPorts[i].posx);
                        } else {
                            console.log("alto: " + canvasS.height + "ancho: " + canvasS.width);
                            $("#posX").val(puntos[index].x*2 - ((canvasS.width*2) / 2));
                            $("#posY").val(puntos[index].y*2 - ((canvasS.height*2) / 2) * 1);
                        }
                    }
                } else {
                    console.log("alto: " + canvasS.height + "ancho: " + canvasS.width);
                    $("#posX").val(puntos[index].x*2 - ((canvasS.width*2) / 2));
                    $("#posY").val((puntos[index].y*2 - ((canvasS.height*2) / 2)) * 1);
                }
            }
        }

    });

    canvasS.addEventListener("mouseup", function (evt) {
        console.log("up");

        if (canvasS.keypuntito !== undefined)
        {
//                    for (var index = 0; index < puntos.length; index++) {
//                        if (puntos[index].id === canvasS.keypuntito)
//                        {
            canvasS.getContext("2d").fillStyle = "red";
            lienzo.fillRect(puntos[canvasS.keypuntito].x, puntos[canvasS.keypuntito].y, puntos[canvasS.keypuntito].w, puntos[canvasS.keypuntito].w);
//                        }
//                    }
//                    canvasS.pusheable = undefined;
            canvasS.keypuntito = undefined;
        }


//                marcarCoords(output, mousePos.x, mousePos.y)
    }, false);

    document.getElementById("rotarR").addEventListener("click", function () {


        if (dataRotation.key !== 3)
        {
            dataRotation.key = dataRotation.key + 1;
        } else
        {
            dataRotation.key = 0;
        }
        let pos = {};
        if (dataRotation.key % 2 === 1)
        {
            pos = {h: dataimg.w, w: dataimg.h};
        } else
        {
            pos = {w: dataimg.w, h: dataimg.h};
        }

        console.log(dataRotation.config[dataRotation.key]);
        canvasF.width = pos.w + 0;
        canvasF.height = pos.h + 0;
        canvasS.width = pos.w + 0;
        canvasS.height = pos.h + 0;
        canvasF.getContext('2d').rotate(dataRotation.config[dataRotation.key].angle);
        canvasF.getContext("2d").drawImage(img,
                dataRotation.config[dataRotation.key].x,
                dataRotation.config[dataRotation.key].y,
                dataimg.w, dataimg.h);


        console.log("Rot");
//                document.getElementById("aux").src = canvasF.toDataURL("image/png");
//                document.getElementById("aux").width =  pos.w;
//                document.getElementById("aux").height = pos.h;
    });
    document.getElementById("rotarL").addEventListener("click", function () {

        if (dataRotation.key !== 0)
        {
            dataRotation.key = dataRotation.key - 1;
        } else
        {
            dataRotation.key = 3;
        }
        let pos = {};
        if (dataRotation.key % 2 === 1)
        {
            pos = {h: dataimg.w, w: dataimg.h};
        } else
        {
            pos = {w: dataimg.w, h: dataimg.h};
        }
        console.log(dataRotation.config[dataRotation.key]);
        canvasF.width = pos.w + 0;
        canvasF.height = pos.h + 0;
        canvasS.width = pos.w + 0;
        canvasS.height = pos.h + 0;
        canvasF.getContext('2d').rotate(dataRotation.config[dataRotation.key].angle);
        canvasF.getContext("2d").drawImage(img,
                dataRotation.config[dataRotation.key].x,
                dataRotation.config[dataRotation.key].y,
                dataimg.w, dataimg.h);


//                document.getElementById("aux").src = canvasF.toDataURL("image/png");
//                document.getElementById("aux").width =  pos.w;
//                document.getElementById("aux").height = pos.h;
    });


    function calcularTamanio(img)
    {
        let porcentaje;
        if (img.height > img.width)
        {
            porcentaje = escalar(img.height, maximH, 10, 0);
        } else
        {
            porcentaje = escalar(img.width, maximW, 10, 0);
        }
        img.height = (img.height * porcentaje) / 100;
        img.width = (img.width * porcentaje) / 100;
        console.log("ok" + img.width);
    }
    function escalar(h, limit, unit, mount)
    {
        if (unit < 0.0001)
        {
            return mount;
        }
        let flag = true, i = 0, val = 0;
        while (flag && i < 1000) {
            if ((h * (mount + (i * unit)) / 100) <= limit && h * ((mount + ((i + 1) * unit)) / 100) > limit)
            {
                val = (i * unit);
                flag = false;
            }
            i++;
        }

        return escalar(h, limit, unit / 10, mount + val);
    }

    //------------------


    function oMousePos(evt) {
        var ClientRect = canvasS.getBoundingClientRect();
        return {//objeto
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        };
    }

    function Entra(x, y, pin)
    {
        return rango(x, pin.x, pin.x + pin.w) && rango(y, pin.y, pin.y + pin.w);
    }
    function rango(dato, min, max)
    {
        return dato >= min && dato <= max;
    }

    function ChocanPines(pin, pin2)
    {
        let mx = pin.x;
        let my = pin.y;

        let mx2 = pin2.x;
        let my2 = pin2.y;

        if (
                ((mx >= mx2 && mx <= mx2 + pin2.w) &&
                        (my >= my2 && my <= my2 + pin2.w)
                        ) || (
                (mx + pin.w >= mx2 && mx <= mx2 + pin2.w) &&
                (my + pin.wt >= my2 && my <= my2 + pin2.w)
                ))
        {
            return true;
        }
        return false;
    }

    //limpiar el formlario de componentes
    function clearComponents() {
        $("#componentName_new").val("");
        $("#description_new").val("");
        $("#codeComponent_new").val("");
        $scope.arrayPorts.length = 0;

        $("#namePort").val("");
        $("#posX").val("");
        $("#posY").val("");
        $("#typeEnergy").prop("checked", false);
        $("#miniumV").prop("checked", false);
        $("#maximumV").prop("checked", false);
        $("#typeDigital").prop("checked", false);
        $("#typeAnalog").prop("checked", false);
        $("#typeData").prop("checked", false);
        document.getElementById("btnAddImgComponent").style.display = "none";
        document.getElementById("sizeShowComponent").style.display = "block";
    }
    
    //especificar el tamanio de la imagen del component
    function changeSize(obj){
        maximH = obj.heigth;
        maximW = obj.width;
        document.getElementById("btnAddImgComponent").style.display = "block";
        document.getElementById("sizeShowComponent").style.display = "none";
        $("#modalSizeComponent").modal("hide"); 
    }
    
    $("#sizeShowComponent").click(function(){
       $("#modalSizeComponent").modal(); 
    });
    
    $("#btnSaveSize").click(function(){
        changeSize({
            width: $("#inputWidth").val(),
            heigth: $("#inputHeigth").val()
        });
    });


});


