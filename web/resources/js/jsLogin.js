/* global GlobalApisLocation */

// AUTOR: 
// Collaborator: 
/** @namespace jsLogin
 * @description This file contains a set of methods that are of global interest to the application.
 */

/**
 * @file This file contains a set of methods that are of global interest to the application.
 * @author DÚVAL CARVAJA, JORGE MOLINA, ANTHONY PACHAY
 * @see <a href="jsLogin.html">jsLogin</a>
 */

/**
 * @property {JsonObject} globalobject This variable is used as a flag to know when to enable the google web service.
 * @memberOf jsLogin
 */
var globalobject = {
    flagApis: false
}
/**
 * @function viewCreateAccount 
 * @memberOf jsLogin
 * @description 
 This function is used to display the form for creating an account.
 */
function viewCreateAccount() {
    document.getElementById("contentCreate").style.display = "block";
    document.getElementById("contentLogin").style.display = "none";
}
/**
 * @function viewLogIn 
 * @memberOf jsLogin
 * @description 
 This function is used to display the login form.
 */
function viewLogIn() {
    document.getElementById("contentCreate").style.display = "none";
    document.getElementById("contentLogin").style.display = "block";
}

$("#btnLogIn").click(function (evt) {
    evt.preventDefault();
//    console.log($("#formLogin").serialize());
    LogIng({
        usr: $("#emailLog").val(),
        pwd: $("#passwordLog").val()
    });
});
function init() {
    gapi.load('auth2', function () {
        auth2 = gapi.auth2.init({
            client_id: '775571983019-1p48q31t4vs36b2t27a2ae1atrla05ap.apps.googleusercontent.com',
            fetch_basic_profile: true, //datos extras
            scope: 'profile'
        });
        gapi.signin2.render("my-signin2", {
            scope: 'email',
            width: 200,
            height: 50,
            longtitle: false,
            theme: 'dark',
            onsuccess: onSignIn,
            onfailure: onFailure,
            margin: 0
        });
    });
}

//inicializa el boton para el registro de google
init();
//detecta errores al presionar el boton de google
function onFailure(error) {
    console.log(error);
}

//obtener los datos de la cuenta
function onSignIn(googleUser) {
    if (globalobject.flagApis)
    {
        let profile = googleUser.getBasicProfile();
//        let jsonEmail = {
//            api: "Google",
//            name: profile.getName(),
//            email: profile.getEmail(),
//            password: profile.getId(),
//            urlimage: profile.getImageUrl()
//        };
        //enviarlos datos a los parametros del modal de usuarios
//        console.log(jsonEmail);
        let processname = profile.getName().toString().split(" ");
        let name_ = profile.getName();
        let lastName_ = "";

        if (processname.length === 1)
        {

            name_ = processname[0] === undefined ? "" : processname[0];
            lastName_ = "Nothing last name";
        } else
        if (processname.length === 2)
        {
            name_ = processname[0] === undefined ? "" : processname[0];
            lastName_ = processname[1] === undefined ? "" : processname[1];
        } else
        {
            if (processname.length === 3)
            {
                name_ = processname[0] === undefined ? "" : processname[0] + " " + processname[1] === undefined ? "" : processname[1];
                lastName_ = processname[2] === undefined ? "" : processname[2];
            } else
            {
                name_ = processname[0] === undefined ? "" : processname[0] + " " + processname[1] === undefined ? "" : processname[1];
                lastName_ = processname[2] === undefined ? "" : processname[2] + " " + processname[3] === undefined ? "" : processname[3];
            }
        }
        $("#api_name").html(name_);
        $("#api_lastname").html(lastName_);
        $("#api_email").html(profile.getEmail());
        $("#api_pwd").val(profile.getId());
        $("#api_img").attr("src", profile.getImageUrl());
        console.log($("#api_pwd").val());
        let prom = LogIng2({'usr': $("#api_email").html(), 'pwd': $("#api_pwd").val()});
        $.when(prom).done(function (result) {
            console.log(result);
            if (result.status === 4 && globalobject.base64flex !== undefined)
            {
               openRegisterModal();
            } else if (result.status === 2) {
                store.session.set("usereacircuits", result.data);
                location.href = "home.html";
            } else
            {
                allMessageXD(result);
            }
        });

    } else {
        globalobject.flagApis = true;
    }
}


function LogIng(obj) {
    $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: GlobalApisLocation + "userApis/login",
        data: JSON.stringify({"usr": obj.usr, "pwd": obj.pwd}),
        beforeSend: function () {
            loading();
        },
        success: function (data) {
            swal.close();
//            console.log(data);
            if (data.status === 2)
            {
                store.session.set("usereacircuits", data.data);
                location.href = "home.html";
            } else if (data.status === 5)
            {
                store.session.set("usereacircuits", data.data);
                location.href = "notverified.html";
            } else
            {
                alertAll(data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

$("#createAccount").click(function () {

    if ($("#firstName_new").val().trim() === "" && $("#lastname_new").val().trim() === "" &&
            $("#confirmPassword_new").val().trim() === "" && $("#password_new").val().trim() === "") {
        allMessageXD({information: "Incomplete fields", "status": 3});
        return;
    }

    if ($("#password_new").val().trim() !== $("#confirmPassword_new").val().trim()) {
        allMessageXD({information: "Passwords are not the same", "status": 3});
        return;
    }

    createNewAccount({
        firstName: $("#firstName_new").val(),
        lastName: $("#lastname_new").val(),
        email: $("#email_new").val(),
        password: $("#confirmPassword_new").val()
//        ,phone: $("#phone_new").val().trim()
    });
});
function createNewAccount(obj) {
    console.log(obj);
    $.ajax({
        method: "POST",
        contentType: "application/json; charset=utf-8",
        url: GlobalApisLocation + "userApis/createuser",
        data: JSON.stringify({
            name: obj.firstName,
            lastname: obj.lastName,
            email: obj.email,
            pass: obj.password,
            img: ""
        }),
        beforeSend: function (data) {
            loading();
        },
        success: function (data) {
            console.log(data);
            if (data.status === 2)
            {
                store.session.set("usereacircuits", data.data);
                location.href = "home.html";
            } else if (data.status === 5)
            {
                store.session.set("usereacircuits", data.data);
                location.href = "notverified.html";
            } else
            {
                alertAll(data);
            }
            swal.close();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

//function openregisterModal(object)
//{
//    console.log("viveee");
//    console.log(object);
//    openModalMSG(object);
//}

function closeRegisterModal() {
    globalobject.base64flex = undefined;
    $('#modalregister').modal('hide');
}
function openRegisterModal() {
//                $("#superModalMSG").slideDown("Quick");
    $('#modalregister').modal();
//    let x = {
//        "name": $("#api_name").val(),
//        "lastname": $("#api_lastname").val(),
//        "email": $("#api_email").val(),
//        "pass": $("#api_pwd").val(),
//        "img": .val()
//    };
//    console.log("holis");
}
//openRegisterModal();

/**
 * 
 */
$("#btnAPIregister").click(function () {
    console.log("que tiro");
    let prom = LogIng2({'usr': $("#api_email").html(), 'pwd': $("#api_pwd").val()});
    $.when(prom).done(function (result) {
        console.log(result);
        if (result.status === 4 && globalobject.base64flex !== undefined)
        {
//register
            console.log("go");
            loading();
//            var img = new img();
//            img.onload = function () {
//                let canvas = document.createElement("CANVAS");
//                let ctx = canvas.getContext("2d");
//                canvas.height = this.height;
//                canvas.width = this.width;
//                ctx.drawImage(this, 0, 0);
//                let dataURL = canvas.toDataURL("image/png");
//
//                console.log(globalobject.base64flex);
//            let usrl = createFromData(globalobject.base64flex, 'usr');
            $.when(createFromData(globalobject.base64flex, 'usr')).done(function (usrl) {
                let regobj = {
                    name: $("#api_name").html(),
                    lastname: $("#api_lastname").html(),
                    email: $("#api_email").html(),
                    pass: $("#passUser").val(),
                    pwdgoogle: $("#api_pwd").val(),
                    img: usrl
                };
                console.log(regobj);
                let prom2 = registorFromAPI(regobj);
                $.when(prom2).done(function (result2) {
                    if (result2.status === 2)
                    {
                        store.session.set("usereacircuits", result2.data);
                        location.href = "home.html";
                    } else
                    {
                        allMessageXD(result2);
                    }
                    closeRegisterModal();
                    globalobject.base64flex = undefined;
                });
            });
//                canvas = null;

//            

//            };
        } else if (result.status === 2) {
            store.session.set("usereacircuits", result.data);
            location.href = "home.html";
        } else
        {
            allMessageXD(result);
        }
    });
});
var urlfake = "data:image/png;base64,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";
//createFromData(urlfake,'usr');

function LogIng2(obj) {
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: GlobalApisLocation + "userApis/login",
        data: JSON.stringify({"usr": obj.usr, "pwd": obj.pwd}),
        beforeSend: function () {
            loading();
        },
        success: function (data) {
            swal.close();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function registorFromAPI(objectUsr)
{
    var a = 1;
    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: GlobalApisLocation + "userApis/createuserfromapi",
        data: JSON.stringify(objectUsr),
        beforeSend: function () {
            loading();
        },
        success: function (data) {
            swal.close();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

$("#btnResendCode").click(function () {
    //console.log($("#formLogin").serialize());
    //console.log("Hola");
    resendCode({
        usr: $("#emailLog").val()
    });
});
function resendCode(object)
{

    return $.ajax({
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        url: GlobalApisLocation + "userApis/resendCodeVerify",
        data: JSON.stringify({"email": object.usr}),
        beforeSend: function () {
            loading();
        },
        success: function (data) {
            swal.close();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}
document.getElementById("api_img").crossOrigin = "Anonymous";
document.getElementById("api_img").onload = function () {
    console.log(this.src);
    if (this.src.toString().indexOf("customer.png") < 0)
    {
        let canvas = document.createElement("CANVAS");
        let ctx = canvas.getContext("2d");
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0, 150, 150);
        globalobject.base64flex = canvas.toDataURL("image/png");
        canvas = null;
//        document.body.appendChild(canvas);
//        this.base64flex = canvas.toDataURL("image/png");
       
    }
};


function Openmodalrecuperateacount()
{
    $("#modalrecuperateacount").modal();
    modalrecuperateacount(0);
}
function closemodalrecuperateacount()
{
    $("#modalrecuperateacount").modal('hide');
}
function modalrecuperateacount(val)
{
    if (val === 1)
    {
        document.getElementById("modalrecuperateacount_1").style.display = 'block';
        document.getElementById("modalrecuperateacount_0").style.display = 'none';
    } else
    {
        document.getElementById("modalrecuperateacount_1").style.display = 'none';
        document.getElementById("modalrecuperateacount_0").style.display = 'block';
    }
}

$("#btn_requestcode").click(function ()
{
    console.log("call");
    //
    let minemail = $("#email_requestcode").val().toString();
    let emvalid = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(minemail);
    if (emvalid)
    {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: GlobalApisLocation + "userApis/requestcodeforchangepassword",
            data: JSON.stringify({"email": minemail}),
            beforeSend: function () {
                $("#loading_requestcode").css("display", "block");
                $('#btn_requestcode').prop('disabled', true);
            },
            success: function (data) {
                $('#btn_requestcode').prop('disabled', false);
                $("#loading_requestcode").css("display", "none");
                console.log(data);
                data.tittle = "Request Code";
                alertAll(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    } else
    {
        let obj = {
            "data": {},
            "information": "The email is not valid.",
            "status": 3,
            "tittle": "Request Code"
        };
        alertAll(obj);
    }
});
$("#btn_changepwd").click(function ()
{
    var patternemvalid = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    var patternpassword = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}/);
    let object = {
        "email": $("#email_changepwd").val().toString(),
        "code": $("#codeemail_changepwd").val(),
        "pwd": $("#pwd_changepwd").val()
    };
    let flag = true;
    console.log(object.email + ":email:" + patternemvalid.test(object.email));
    if (!patternemvalid.test(object.email) && flag)
    {
        flag = false;
        let obj = {
            "data": {},
            "information": "The email is not valid.",
            "status": 3,
            "tittle": "Change Password."
        };
        alertAll(obj);
    }
    if ($("#newpwd_changepwd").val() !== object.pwd && flag)
    {
        flag = false;
        let obj = {
            "data": {},
            "information": "Passwords do not match.",
            "status": 3,
            "tittle": "Change Password."
        };
        alertAll(obj);
    }
    if (!patternpassword.test($("#newpwd_changepwd").val()) && flag)
    {
        flag = false;
        let obj = {
            "data": {},
            "information": "The password does not meet the required parameters.",
            "status": 3,
            "tittle": "Change Password."
        };
        alertAll(obj);
    }

    if (flag)
    {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: GlobalApisLocation + "userApis/confirmpwd",
            data: JSON.stringify(object),
            beforeSend: function () {
                $("#loading_requestcode").css("display", "block");
                $('#btn_requestcode').prop('disabled', true);
            },
            success: function (data) {
                $('#btn_requestcode').prop('disabled', false);
                $("#loading_requestcode").css("display", "none");
                console.log(data);
                data.tittle = "Password Change.";
                alertAll(data);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
});

function fastchangepwd()
{
    if (location.search.length > 0)
    {
        let sarch = location.search.toString().replace(/\?/, "");
        window.history.replaceState(null, null, "/" + proyectName() + "login.html");
        let parts = sarch.split("&");
//        console.log(parts);
        let obj = {};
        for (var index = 0; index < parts.length; index++) {
            let minpart = parts[index].toString().split("=");
            if (minpart[0] !== undefined && minpart[1] !== undefined)
            {
                obj[minpart[0]] = minpart[1];
            }
        }
        if (obj.op === "reset")
        {
            $("#codeemail_changepwd").val(obj.code);
            $("#email_changepwd").val(obj.usr);
            Openmodalrecuperateacount();
            modalrecuperateacount(1);
        }
    }
}
function proyectName() {
    let rutaAbsoluta = location.pathname.toString().substring(1);
    let posicionUltimaBarra = rutaAbsoluta.toString().indexOf("/");
    rutaAbsoluta = rutaAbsoluta.substring(0, posicionUltimaBarra);
    rutaAbsoluta = (rutaAbsoluta === undefined) ? "" : rutaAbsoluta;
    if (rutaAbsoluta.length !== 0)
    {
        rutaAbsoluta += "/";
    }
    return rutaAbsoluta;
}

$(document).ready(function () {
    fastchangepwd();
});