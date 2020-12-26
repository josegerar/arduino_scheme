/**
 * @class angular_module.app
 * @type angular.module.angular-1_3_6_L1749.moduleInstance
 */
app = angular.module('app', []);
/**
 * @function controllerMyComponents
 * @memberOf angular_module.app
 * @description This is an angularjs service.
 * @param {$scope} $scope description -> scope xd
 * @param {$http} $http description -> $http efe
 */
app.controller('controllerMyComponents', function ($scope, $http) {
    /**
     * @name $scope.arrayComponentsInctive
     * @function $scope.arrayComponentsInctive
     * @memberOf angular_module.app
     * @description this is user to save an array of components inactives
     */
    $scope.arrayComponentsInctive = [];
    /*obtener los datos de la session iniciada*/
    function getComponentsInctive() {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/getComponentsPropuesta',
                data: JSON.stringify({"user_token": dataUser.user_token}),
                beforeSend: function () {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Get Components Propuesta";
                    console.log(responseJson);
                    $scope.$apply(function () {
                        $scope.arrayComponentsInctive = responseJson.data;
                        if (responseJson.status) {
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

    $scope.aproveComponent = function (position) {
        var dataUser = store.session.get("usereacircuits");
        if (dataUser !== undefined && dataUser !== null)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + 'components/aproveComponent',
                data: JSON.stringify({
                    "user_token": dataUser.user_token,
                    idComponent: $scope.arrayComponentsInctive[position].id_com
                }),
                beforeSend: function (data) {
                    loading();
                },
                success: function (data) {
                    swal.close();
//                    console.log(data);
                    var responseJson = data;
                    responseJson.tittle = "Aprove Component";
//                    console.log(responseJson);
                    $scope.$apply(function () {
                        $scope.arrayComponentsInctive = responseJson.data;
                        if (responseJson.status === 2) {
//                        getComponentsInctive();
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
    };
    getDataSession();
    getComponentsInctive();
});

