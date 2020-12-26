/* global GlobalApisLocation, swal */

app = angular.module('app', []);
app.controller('controllerHome', function ($scope, $http) {
    $scope.tableEmailShareProjects = [];
    $scope.dataShareProjects = [];
    $scope.dataShareProjectsConfirm = [];
    $scope.dataProjects = [];
    $scope.dataSystemIot = [];
    $scope.flagmodalusermodify = [];
    var dataForTheSharedProject = {};
    var dataForTheNewSystem = {};
    var editor = "";

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    /*agregamos los email a un json para visualizarlos en el DOM*/
    function addEmail(obj) {
        $scope.$apply(function () {
            $scope.tableEmailShareProjects.push({
                email: obj.email,
                permit: obj.permit
            });
        });

    }
    /*agregar email para compartir el proyecto con otro usuarios registrados*/
    $("#addEmailShareProject").click(function () {
        var regexEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;


        if ($("#txtemail").val().trim() === "" && $("#cbxPermit").val() === "Permit...") {
            alertAll({information: "Enter at least one email", status: 3});
            return;
        }

        if ($("#txtemail").val().trim() === "" && $("#cbxPermit").val() !== "Permit...") {
            alertAll({information: "Enter at least one email", status: 3});
            return;
        }

        if ($("#txtemail").val().trim() !== "" && $("#cbxPermit").val() === "Permit...") {
            alertAll({information: "Enter at least one email", status: 3});
            return;
        }
        if (!regexEmail.test($("#txtemail").val())) {
            alertAll({information: "Enter at least one email", status: 3});
            return;
        }

        addEmail({
            email: $("#txtemail").val(),
            permit: $("#cbxPermit").val()
        });
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
        console.log($scope.tableEmailShareProjects);
    });

    /*oobtener los datos del proyecto el cual sera compartido con otros usuarios que esten ya registrados
     lo que propongo es compartir el proyecto desde la BD .. pero el usaurio al que le comparti debera confirmar
     que es el dueño de la cuenta ingresando el codigo de confirmacion del proyecto*/
    $scope.btnShareProject = function (position) {
        $("#modalSharePorject").modal();
        dataForTheSharedProject = {
            codeProject: $scope.dataProjects[position].code_project,
            nameProject: $scope.dataProjects[position].name_project,
            dateCreationProject: $scope.dataProjects[position].creationdate_project,
            idProject: $scope.dataProjects[position].projects_id_pr
        };
        console.log(dataForTheSharedProject);
    };

    /*function que enviara los datos a la BD y proximamente enviara los correos a todos los seleccionados*/
    function saveShareProject(obj) {
        let jsonEmails = [];
        for (let index = 0; index < $scope.tableEmailShareProjects.length; index++) {
            jsonEmails.push($scope.tableEmailShareProjects[index]);
        }

        console.log(jsonEmails);

        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            let objectProj = {
                user_token: dataUser.user_token,
                idProject: obj.idProject,
                emails: jsonEmails
            };
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/shareProject',
                data: JSON.stringify(objectProj),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "ShareProject";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        alertAll(responseJson);
                        loadProjects();
                        $("#modalSharePorject").modal("hide");
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    $("#btnModalShareProject").click(function () {
        saveShareProject(dataForTheSharedProject);
    });

    $("#btnShareProject").click(function () {
        console.log("que tiro");
        openmModalShareProject();
    });

    $(document).ready(function () {
        getDataSession();
        loadProjects();
        loadSahreProjects();
        loadSahreProjectsConfirm();
    });

    /*funcion para guardar un nuevo proyecto*/
    function saveProject(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/' + obj.option,
                data: JSON.stringify({
                    user_token: dataUser.user_token,
                    nameProject: obj.nameProject,
                    descriptionProjec: obj.descriptionProject
                }),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Create Project";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        alertAll(responseJson);
                        loadProjects();
                        closeModalNameProject();
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    $("#btnSaveProject").click(function () {

        if ($("#projectName").val().trim() === "" && $("#projectDescription").val().trim() === "") {
            alertAll({information: "Incomplete mandatory fields", status: 3});
            return;
        }
        saveProject({
            option: "saveProject",
            nameProject: $("#projectName").val(),
            descriptionProject: $("#projectDescription").val()
        });
    });

    /*funcion para cargar los projects por usuario*/
    function loadProjects() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/getProjects',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Get Projects";
                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        $scope.$apply(function () {
                            $scope.dataProjects = responseJson.data;
//                            console.log($scope.dataProjects);
                            alertAll(responseJson);

                            /*funcion para cargar el tooltip bonito*/
                            $(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            });

                        });
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
//                    location.href = "login.html";
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    /*funcion para cargar los projects compartidos por usuario por confirmar*/
    function loadSahreProjects() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/getLoadShareProjectsForConfirm',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Projects For Confirm";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        $scope.$apply(function () {
                            $scope.dataShareProjects = responseJson.data;
//                            console.log($scope.dataShareProjects),
//                                    successTo(responseJson);
                            alertAll(responseJson);
                            /*funcion para cargar el tooltip bonito*/
                            $(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            });

                        });
                    } else {
                        alertAll(responseJson);
                    }
                }
                ,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
//                    location.href = "login.html";
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    /*funcion para cargar los projects compartidos por usuario confirmados*/
    function loadSahreProjectsConfirm() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/getLoadShareProjectsConfirm',
                data: JSON.stringify({"user_token": dataUser.user_token}),

                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Confirmed Projects";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        $scope.$apply(function () {
                            $scope.dataShareProjectsConfirm = responseJson.data;
                            console.log($scope.dataShareProjectsConfirm);
//                                    successTo(responseJson);
                            alertAll(responseJson);
                            /*funcion para cargar el tooltip bonito*/
                            $(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            });

                        });
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
//                    location.href = "login.html";
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    $("#btnLogOff").click(function () {
        logOff();
    });

    $("#loadSharedProjects").click(function () {
        document.getElementById("circuitProjects").style.display = "none";
        document.getElementById("project").style.display = "none";
        document.getElementById("shareProjectsData").style.display = "block";
    });

    /*variable para saber en que tipo de permiso tiene el usuario perteneciente al proyecto que le esta dando click*/

    var positionPermitProjects = "-1";
    var positionPermitProjectsShare = "-1";

    $scope.btnOpenProject = function (position) {
        positionPermitProjects = position;
        positionPermitProjectsShare = "-1";
        openProject();
        dataForTheNewSystem = {
            permitmasterId: $scope.dataProjects[position].id_pm,
            projectId: $scope.dataProjects[position].projects_id_pr
        };
        loadSystemIot({
            id: $scope.dataProjects[position].projects_id_pr
        });
        document.getElementById("nameProject").innerHTML = "Systems IoT - " + $scope.dataProjects[position].name_project;
        document.getElementById("menuSIOT").innerHTML = "Systems IoT - " + $scope.dataProjects[position].name_project;
        document.getElementById("permitProject").innerHTML = $scope.dataProjects[position].description_permitmaster;
    };

    ////// modificacion fecha: 26-08-2020///////

    $scope.btnOpenShareProject = function (position) {
        positionPermitProjectsShare = position;
        positionPermitProjects = "-1";
        openProject();

        dataForTheNewSystem = {
            permitmasterId: $scope.dataShareProjectsConfirm[position].id_pm,
            projectId: $scope.dataShareProjectsConfirm[position].projects_id_pr
        };
        loadSystemIot({
            id: $scope.dataShareProjectsConfirm[position].id_pr
        });
        document.getElementById("nameProject").innerHTML = "Systems IoT - " + $scope.dataShareProjectsConfirm[position].name_project;
        document.getElementById("menuSIOT").innerHTML = "Systems IoT - " + $scope.dataShareProjectsConfirm[position].name_project;
        document.getElementById("permitProject").innerHTML = $scope.dataShareProjectsConfirm[position].description_permitmaster;
    };

    //funcion para desear eliminar un sistemma verificando si tiene los permisos respectivos
    $scope.deleteSystem = function (position) {
        if (positionPermitProjects !== "-1")
        {
            if ($scope.dataProjects[positionPermitProjects].description_permitmaster === "ROOT")
            {
                swal({
                    title: "Are you sure?",
                    text: "This user will no longer have access to this project or its IoT systems.!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                }).then((willDelete) => {
                    if (willDelete)
                    {
                        deleteJobsRoot({"idJobs": $scope.dataSystemIot[position].id_job});
                    } else
                    {
                        alertAll({"information": "Your user's permission is safe", "status": 1});
                    }
                });
            } else
            {
                allMessageXD({information: "You do not have the necessary permission to perform this action", "status": 3});
            }
        } else
        {
            if ($scope.dataShareProjectsConfirm[positionPermitProjectsShare].description_permitmaster === "ADMIN")
            {
                swal({
                    title: "Are you sure?",
                    text: "This user will no longer have access to this project or its IoT systems.!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true
                }).then((willDelete) => {
                    if (willDelete)
                    {
                        deleteJobsAdmin({"idProject": $scope.dataShareProjectsConfirm[positionPermitProjectsShare].id_pr, "idJobs": $scope.dataSystemIot[position].id_job});

                    } else
                    {
                        alertAll({"information": "Your user's permission is safe", "status": 1});
                    }
                });
            } else
            {
                allMessageXD({information: "You do not have the necessary permission to perform this action", "status": 3});
            }
        }
    };

    //funcion para abrir el modal de confirmacion 
    $scope.btnConfirm = function (position) {
        $("#modalConfirmShareProject").modal();
    };

    $("#btnConfirmProject").click(function () {
        confirmProject({
            code: $("#codeShareProject").val()
        });
    });

    function confirmProject(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/confirmShareProject',
                data: JSON.stringify({"user_token": dataUser.user_token, code_project: obj.code}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Share Project";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        $("#modalConfirmShareProject").modal("hide");
                        $("#codeShareProject").val("");
                        alertAll(responseJson);
                        loadSahreProjects();
                        loadSahreProjectsConfirm();
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    $("#btnNewSystem").click(function () {
        if (positionPermitProjects !== "-1") {
            if ($scope.dataProjects[positionPermitProjects].description_permitmaster === "ROOT") {
                $("#modalNewSystemIOT").modal();
            } else {
                allMessageXD({"information": "You do not have the necessary permission to create a new IoT system", "status": 3});
            }
        } else {
            if ($scope.dataShareProjectsConfirm[positionPermitProjectsShare].description_permitmaster === "ADMIN" || $scope.dataShareProjectsConfirm[positionPermitProjectsShare].description_permitmaster === "WRITE") {
                $("#modalNewSystemIOT").modal();
            } else {
                allMessageXD({"information": "You do not have the necessary permission to create a new IoT system", "status": 3});
            }
        }
    });

    $("#btnNewSystem01").click(function () {

        if (positionPermitProjects !== "-1") {
            if ($scope.dataProjects[positionPermitProjects].description_permitmaster === "ROOT") {
                $("#modalNewSystemIOT").modal();
            } else {
                allMessageXD({"information": "You do not have the necessary permission to create a new IoT system", "status": 3});
            }
        } else {
            if ($scope.dataShareProjectsConfirm[positionPermitProjectsShare].description_permitmaster === "ADMIN" || $scope.dataShareProjectsConfirm[positionPermitProjectsShare].description_permitmaster === "WRITE") {
                $("#modalNewSystemIOT").modal();
            } else {
                allMessageXD({"information": "You do not have the necessary permission to create a new IoT system", "status": 3});
            }
        }


    });

    function saveSystem(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/saveSystem',
                data: JSON.stringify({"user_token": dataUser.user_token,
                    systemName: obj.systemName,
                    description: obj.description,
                    permitMasterId: dataForTheNewSystem.permitmasterId,
                    projectId: dataForTheNewSystem.projectId}),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Save System";
//                    console.log(responseJson);
                    if (responseJson.status === 2) {
                        alertAll(responseJson);
                        loadSystemIot({id: dataForTheNewSystem.projectId});
                        $("#modalNewSystemIOT").modal("hide");
                    } else {
                        alertAll(responseJson);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    $("#btnSaveSystem").click(function () {

        if ($("#nameSystem").val().trim() === "" && $("#descriptionSystem").val().trim() === "") {
            alertAll({information: "Incomplete mandatory fields", status: 3});
            return;
        }

        saveSystem({
            systemName: $("#nameSystem").val(),
            description: $("#descriptionSystem").val()
        });
    });

    function loadSystemIot(obj) {
//        console.log("consulta");
//        console.log(obj);
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/getjobs',
                data: JSON.stringify({"user_token": dataUser.user_token,
                    projectId: obj.id
                }),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Get Jobs";
                    $scope.$apply(function () {
//                    console.log(responseJson);
                        if (responseJson.status === 2) {
                            $scope.dataSystemIot = responseJson.data;
                            console.log($scope.dataSystemIot),
                                    alertAll(responseJson);
                            /*funcion para cargar el tooltip bonito*/
                            $(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            });
                        } else {
                            $scope.dataSystemIot.length = 0;
                            alertAll(responseJson);
                        }
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        } else {
            location.href = "login.html";
        }
    }

    function backToProjects() {
        document.getElementById("circuitProjects").style.display = "none";
        document.getElementById("project").style.display = "block";
        document.getElementById("shareProjectsData").style.display = "none";
        document.getElementById("moduleCircuits").style.display = "none";
        $scope.dataSystemIot.length = 0;
    }

    $("#back").click(function () {
        backToProjects();
    });

    $("#back02").click(function () {
        backToProjects();
    });

    $scope.updateSystem = function (position) {
        console.log("posición");
//        console.log("workArea.html?tk="+encodeURI($scope.dataSystemIot[position].code_job));
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            location.href = "workArea.html?tk=" + encodeURI($scope.dataSystemIot[position].code_job);
        } else {
            location.href = "login.html";
        }
    };

    $("#btnItems").click(function () {
        location.href = "Components.html";
    });

    $("#btnNewItems").click(function () {
        location.href = "NewComponents.html";
    });

    $scope.usersJoinProjects = [];
    $scope.userJoinsProjects = function (position) {
        loadUsersJoinProjects({"projectId": $scope.dataProjects[position].projects_id_pr});
        $("#modalUsersJoin").modal();
    };

    $scope.userJoinsProjectsShare = function (position) {
        $("#modalUsersJoinShare").modal();
        loadUsersJoinProjects({"projectId": $scope.dataShareProjectsConfirm[position].id_pr});
    };

    $scope.shareProjectShare = function (position) {
        let permit = $scope.dataShareProjectsConfirm[position].description_permitmaster;
        if (permit === "ADMIN") {
            $("#modalSharePorject").modal();
            dataForTheSharedProject = {
                codeProject: $scope.dataShareProjectsConfirm[position].code_project,
                nameProject: $scope.dataShareProjectsConfirm[position].name_project,
                dateCreationProject: $scope.dataShareProjectsConfirm[position].creationdate_project,
                idProject: $scope.dataShareProjectsConfirm[position].projects_id_pr
            };
        } else {
            allMessageXD({"information": "You do not have the necessary permissions to share the project with other users.", status: 3});
        }
    };

    function loadUsersJoinProjects(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/userJoinProjects', //loadSystemTotal
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "projectId": objectx.projectId
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                console.log(data);
                    responseA = data;
                    $scope.usersJoinProjects.length = 0;
                    $scope.$apply(function () {
                        $scope.usersJoinProjects = data.data;
                        console.log(responseA);
//                    debugger;
                    });

                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    var flagPermit = false;
    var idPermitX = "";

    $scope.updatePermit = function (position) {
        if (!flagPermit) {
            $("#select" + $scope.usersJoinProjects[position].id_user).prop("disabled", false);
            flagPermit = true;
            idPermitX = $scope.usersJoinProjects[position].id_user;
            var selectPermit = document.querySelector("#select" + $scope.usersJoinProjects[position].id_user);
            for (let i = selectPermit.options.length; i >= 0; i--) {
                selectPermit.remove(i);
            }
            let namePermit = ["ADMIN", "READ", "WRITE"];
            for (let j = 0; j < 3; j++) {
                var option = document.createElement("option");
                option.value = namePermit[j];
                option.text = namePermit[j];
                //option.setAttribute("ng-click", "newPermit($index)");
                selectPermit.appendChild(option);
            }


        } else {
            allMessageXD({information: "You are currently editing the data of a row.", status: 3});
        }
    };

    var clicks = 0;
    $scope.newPermit = function (position) {
        if (clicks > 0) {
            let permitSelection = $("#select" + $scope.usersJoinProjects[position].id_user).val();
            if (permitSelection !== $scope.usersJoinProjects[position].description_permitmaster) {
                updatePermitBD({"descriptionPM": permitSelection, "idPM": $scope.usersJoinProjects[position].id_pm});
                const selectPermit = document.querySelector("#select" + $scope.usersJoinProjects[position].id_user);
                loadUsersJoinProjects({"projectId": $scope.usersJoinProjects[position].projects_id_pr});
                for (let i = selectPermit.options.length; i >= 0; i--) {
                    selectPermit.remove(i);
                }
                var option = document.createElement("option");
                option.value = permitSelection;
                option.text = permitSelection;
                //option.setAttribute("ng-click", "newPermit($index)");
                selectPermit.appendChild(option);
                clicks = 0;
                flagPermit = false;
                console.log($("#select" + $scope.usersJoinProjects[position].id_user).val());
                $("#select" + $scope.usersJoinProjects[position].id_user).prop("disabled", true);
            } else {
                allMessageXD({information: "You selected the current permission of the user.", status: 3});
            }
        } else {
            clicks++;
        }
    };

    function updatePermitBD(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/updatePermit', //loadSystemTotal
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "descriptionPM": objectx.descriptionPM,
                    "idPM": objectx.idPM
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                console.log(data);
                    responseA = data;
                    $scope.$apply(function () {
                        //$scope.usersJoinProjects = data.data;
                        console.log(responseA);
                        alertAll(responseA);
//                    debugger;
                    });

                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    $scope.deleteUserJoin = function (position) {
        swal({
            title: "Are you sure?",
            text: "This user will no longer have access to this project or its IoT systems.!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteUserJoinX({
                            "idPM": $scope.usersJoinProjects[position].id_pm
                        });
                    } else {
                        alertAll({"information": "Your user's permission is safe", "status": 1});
                    }
                });
    };

    function deleteUserJoinX(obj) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/deleteUserJoin', //loadSystemTotal
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idPM": obj.idPM
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                console.log(data);
                    responseA = data;
                    $scope.$apply(function () {
                        //$scope.usersJoinProjects = data.data;
                        console.log(responseA);
                        alertAll(responseA);
//                    debugger;
                    });

                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }
    function initCodeEditor() {
        var langTools = ace.require("ace/ext/language_tools");
        var x = ace.require("require('ace/multi_select'");
        //instancia de su editor
        editor = window.CE = ace.edit("editorCode");
        //if (band === false)
        //{
        editor.setValue("//Create by EaCircuits \n\
void setup()\n\
{\n\
    Serial.begin(9600);\n\
}\n\
void loop()\n\
{\n\
\n\
} ");
        //}
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
    }

    //funcion que actualiazara el codigo por cualqueir modificacion que se valla realizando
    function updateCodeEditor(obj) {
        code = "";
        editor.setValue(code);
        code += "//Create by EaCircuits \n";
        //actualizamos los cambios realizados en el json de las variables
        //obj[1].pinMode = $scope.jsonValueDigitalAnalog;

        for (var indexVariables = 0; indexVariables < obj[0].variables.length; indexVariables++) {
            code += obj[0].variables[indexVariables].type + " " + obj[0].variables[indexVariables].var + ";\n";
        }
        code += "\n";
        code += "void setup () \n";
        code += "{ \n";
        code += "    Serial.begin(9600); \n";

        for (var indexVariables = 0; indexVariables < obj[1].pinMode.length; indexVariables++) {
            code += "    " + obj[1].pinMode[indexVariables].pinModePort + "\n";
        }

        for (var indexVariables = 0; indexVariables < obj[0].variables.length; indexVariables++) {
            code += "    " + obj[0].variables[indexVariables].var + " = " + obj[0].variables[indexVariables].value + ";\n";
        }
        code += "}\n";
        code += "void loop() \n\
{\n";

        for (var indexVariables = 0; indexVariables < obj[1].pinMode.length; indexVariables++) {
            if (obj[1].pinMode[indexVariables].out_inp === true) {
                code += "    " + obj[1].pinMode[indexVariables].valueWriteRaad + "\n";
            }
        }

        code += analize(obj[2].logic, 1);

        code += "}";
        editor.setValue(code);

        console.log(code);
        //function para inicializar los tooltip de los componentes de boostrap
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

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

    $scope.openCodeSystem = function (position) {
        loadSystem({"tk": encodeURI($scope.dataSystemIot[position].code_job)});
    };

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
                    swal.close();
//                console.log(data);
                    responseA = data;
                    $scope.codeProyect = JSON.parse(data.data.system[0].modelCode);
                    initCodeEditor();
                    if ($scope.codeProyect.length > 0) {
                        updateCodeEditor($scope.codeProyect);
                    }
                    $("#modalCode").modal();
                    console.log($scope.codeProyect);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    $("#btnDownload").click(function () {
        this.href = 'data:text/plain;charset=utf-8,'
                + encodeURIComponent(editor.getValue());
    });



    function deleteJobsRoot(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/deleteJobsRoot', //deleteJobsRoot
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idJobs": objectx.idJobs
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                  console.log(data);
                    responseA = data;
                    if (responseA.status === 2) {
                        loadSystemIot({id: dataForTheNewSystem.projectId});
                        allMessageXD(responseA);
                    } else {
                        allMessageXD(responseA);
                    }
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    function deleteJobsAdmin(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/deleteJobsAdmin', //deleteJobsRoot
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idProject": objectx.idProject,
                    "idJobs": objectx.idJobs
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                  console.log(data);
                    responseA = data;

                    if (responseA.status === 2) {
                        loadSystemIot({
                            id: $scope.dataShareProjectsConfirm[positionPermitProjectsShare].projects_id_pr
                        });
                    }
                    console.log(responseA);
                    allMessageXD(responseA);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    $scope.deleteProjects = function (position) {
        swal({
            title: "Are you sure?",
            text: "This project will be eliminated for you and all the users together!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteProjects({"idProject": $scope.dataProjects[position].projects_id_pr});
                    } else {
                        alertAll({"information": "Your project is safe", "status": 1});
                    }
                });
    };

    $scope.deleteProjectsSahre = function (position) {
        swal({
            title: "Are you sure?",
            text: "This project will be eliminated for you and all the users together!",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
                .then((willDelete) => {
                    if (willDelete) {
                        deleteProjectsSahre({"idPermitMaster": $scope.dataShareProjectsConfirm[position].id_pm});
                    } else {
                        alertAll({"information": "Your project is safe", "status": 1});
                    }
                });
    };

    function deleteProjectsSahre(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/deleteProjectsShare', //deleteProjects
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idPermitMaster": objectx.idPermitMaster
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                  console.log(data);
                    responseA = data;

                    if (responseA.status === 2) {
                        loadSahreProjectsConfirm();
                    }
                    console.log(responseA);
                    allMessageXD(responseA);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }


    function deleteProjects(objectx) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'projectsApis/deleteProjects', //deleteProjects
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    "idProject": objectx.idProject
                }),
                beforeSend: function (xhr) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                  console.log(data);
                    responseA = data;

                    if (responseA.status === 2) {
                        loadProjects();
                    }
                    console.log(responseA);
                    allMessageXD(responseA);
                },
                error: function (objXMLHttpRequest) {
                    console.log("error: ", objXMLHttpRequest);
                }
            });
        } else
        {
            location.href = "login.html";
        }
    }

    $scope.OpenmodalUser = function (val)
    {
        $("#modalusermodify").modal();
        $scope.flagmodalusermodify = val;
        $("#bufferimage_usermodify").attr("src", $("#imgUser02").attr("src"));
    };
    $scope.closemodalUser = function ()
    {
        $("#modalusermodify").modal('hide');
    };
    $("#picture_usermodify").change(function () {
        console.log("holis");
        console.log($("#picture_usermodify").prop("files"));
        let fileReader = new FileReader();
        fileReader.readAsDataURL($("#picture_usermodify").prop("files")[0]);
        fileReader.onloadend = function (event) {
            $("#bufferimage_usermodify").attr("src", event.target.result);
        };
    });

    $("#btn_usermodify_img").click(function () {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            if ($("#bufferimage_usermodify").attr("src") !== ""
                    && $("#bufferimage_usermodify").attr("src") !== $("#imgUser02").attr("src"))
            {
                $("#loading_usermodify_img").css("display", "block");
                $("#unloading_usermodify_img").css("display", "none");
                $('#btn_usermodify_img').prop('disabled', true);

                $.when(saveFileCloudy($("#picture_usermodify").prop("files")[0], 'usr')).done(function (superurl) {
                    $.ajax({
                        method: "POST",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        url: GlobalApisLocation + 'userApis/updateuser', //loadSystemTotal
                        data: JSON.stringify({
                            "user_token": dataUser.user_token,
                            "name": dataUser.names_user,
                            "lastname": dataUser.lastname_user,
                            "email": dataUser.email_user,
                            "phonenumbre": dataUser.phonenumbre_user,
                            "urlimg": superurl
                        }),
                        beforeSend: function (xhr) {
//                    loading();
                        },
                        success: function (data) {
                            console.log("cambiandooo");
                            console.log(data);
                            enabledimgbuffer();
                            alertAll(data);
                            if (data.status === 2) {
                                store.session.set("usereacircuits", data.data);
                                location.reload();
                            }
                        },
                        error: function (objXMLHttpRequest) {
                            console.log("error: ", objXMLHttpRequest);
                            enabledimgbuffer();
                        }
                    });
                }).fail(function (data) {
                    enabledimgbuffer();
                });
            } else {
                alertAll({status: 3, tittle: "Change User Image.", information: "Some value has not been selected as a user image."});
            }
        } else
        {
            location.href = "login.html";
        }
    });
    function enabledimgbuffer() {
        $("#loading_usermodify_img").css("display", "none");
        $("#unloading_usermodify_img").css("display", "block");
        $('#btn_usermodify_img').prop('disabled', false);
    }
    function enableduserinfo() {
        $("#loading_usermodify").css("display", "none");
        $("#unloading_usermodify").css("display", "block");
        $('#btn_usermodify').prop('disabled', false);
    }

    $("#btn_usermodify").click(function ()
    {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            let patternemvalid = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
            let rgxNum = new RegExp(/^[0-9]{8,15}/);

//            console.log(patternemvalid.test($("#email_usermodify").val().trim()) + "valid email");
//            console.log(patternemvalid.test(rgxNum.test($("#phone_usermodify").val())) + "valid #phon");
            if (
                    patternemvalid.test($("#email_usermodify").val().trim()) &&
                    $("#names_usermodify").val().trim() !== "" &&
                    $("#lastnames_usermodify").val().trim() !== "" &&
                    rgxNum.test($("#phone_usermodify").val()))
            {
                $("#loading_usermodify").css("display", "block");
                $("#unloading_usermodify").css("display", "none");
                $('#btn_usermodify').prop('disabled', true);

                $.ajax({
                    method: "POST",
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    url: GlobalApisLocation + 'userApis/updateuser', //loadSystemTotal
                    data: JSON.stringify({
                        "user_token": dataUser.user_token,
                        "name": $("#names_usermodify").val().trim(),
                        "lastname": $("#lastnames_usermodify").val().trim(),
                        "email": $("#email_usermodify").val().trim(),
                        "phonenumbre": $("#phone_usermodify").val().trim(),
                        "urlimg": dataUser.img_user
                    }),
                    beforeSend: function (xhr) {
//                    loading();
                    },
                    success: function (data) {
                        console.log("cambiandooo");
                        console.log(data);
                        enableduserinfo();
                        alertAll(data);
                        if (data.status === 2) {
                            store.session.set("usereacircuits", data.data);
                            location.reload();
                        }
                    },
                    error: function (objXMLHttpRequest) {
                        console.log("error: ", objXMLHttpRequest);
                        enableduserinfo();
                    }
                });
            } else {
                alertAll({status: 3, tittle: "Change Data User.", information: "The input parameters do not meet the requirements."});
            }
        } else
        {
            location.href = "login.html";
        }
    });
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function openProject() {
    document.getElementById("circuitProjects").style.display = "block";
    document.getElementById("project").style.display = "none";
    document.getElementById("shareProjectsData").style.display = "none";
    document.getElementById("moduleCircuits").style.display = "block";
}

function openModalNameProject() {
    $("#modalNamePorject").modal();
}

function closeModalNameProject() {
    $("#modalNamePorject").modal("hide");
}

$("#btnNewProject").click(function () {
    openModalNameProject();
});

function openmModalShareProject() {
    $("#modalSharePorject").modal();
}
async function saveFileCloudy(file, flag)
{
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
