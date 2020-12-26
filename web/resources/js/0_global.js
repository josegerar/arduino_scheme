/* global axios */

/**
 * @file This page contains global variables and methods, used by the whole application.
 * @author DÚVAL CARVAJA, JORGE MOLINA, ANTHONY PACHAY
 * @see <a href="0_global.html">0_global</a>
 */

/** @namespace 0_global
 * @description This file contains a set of methods that are of global interest to the application.
 */

/**
 * @property {String} GlobalApisLocation This global variable represents the location of the web services used by the application
 * @memberOf 0_global
 */

var GlobalApisLocation = "http://localhost:8080/eacircuitsserver/webresources/";


//var GlobalApisLocation = "http://958aabae0454.ngrok.io/eacircuitsserver/webresources/";
/***
 * This function is used to close the session
 * @returns {undefined}
 =======
 /**
 * @function logOff 
 * @memberOf 0_global
 * @description This function is used to close the session.
 * @example
 * logOff();
 * @example
 * <button>onclick='logOff()'></button>
 >>>>>>> dc9cfa7e8aa6cefc9be4ecfe624a22be6e1f148f
 */
function logOff() {
    store.session.set("usereacircuits", undefined);
    location.href = "login.html";
}
/**
 * @function getDataSession 
 * @memberOf 0_global
 * @description 
 This function allows you to know if you have a valid session and obtain personal data to be displayed from the user, if the session is invalid, it is redirected to the log in.
 */
function getDataSession() {
    var dataUser = store.session.get("usereacircuits");
    if (dataUser !== undefined && dataUser !== null)
    {
        $.ajax({
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            url: GlobalApisLocation + 'userApis/getdatasession',
            data: JSON.stringify({"user_token": dataUser.user_token}),
            beforeSend: function () {
                loading();
            },
            success: function (data) {
                swal.close();
                if (data.status === 2)
                {
                    if (dataUser !== undefined)
                    {
                        let nameformat = dataUser.names_user + (dataUser.names_user.toString().indexOf(" ") > -1 ? ("<br/>") : " ") + dataUser.lastname_user;
                        if (document.getElementById("btnNewItems") !== null)
                        {
                            if (dataUser.type_user === "Administrator") {
                                document.getElementById("btnNewItems").style.display = "block";
                            } else {
                                document.getElementById("btnNewItems").style.display = "none";
                            }
                            document.getElementById("nameUser02").innerHTML = nameformat;
                            document.getElementById("imgUser02").src = dataUser.img_user;

                            document.getElementById("names_usermodify").value = dataUser.names_user;
                            document.getElementById("lastnames_usermodify").value = dataUser.lastname_user;
                            document.getElementById("email_usermodify").value = dataUser.email_user;
                            document.getElementById("phone_usermodify").value = dataUser.phonenumbre_user;
                            document.getElementById("urlimg_usermodify").value = (dataUser.img_user === undefined) ? "" : dataUser.img_user;
                        }
                        if (document.getElementById("nameUser01") !== null)
                        {
                            document.getElementById("nameUser01").innerHTML = dataUser.names_user + " " + dataUser.lastname_user;
                            document.getElementById("rolUser").innerHTML = dataUser.type_user;
                        }
                        document.getElementById("imgUser01").src = dataUser.img_user;
                    } else {
                        allMessageXD({status: 4, information: "The session was destroyed :c."});
                    }
                } else if (data.status === 5)
                {
                    location.href = "notverified.html";
                } else
                {
                    location.href = "login.html";
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
                location.href = "login.html";
            }
        });

    } else
    {
        location.href = "login.html";
    }
}

/**
 * @function createFromData 
 * @memberOf 0_global
 * @description This async function allows to store an image in clodinary from a base64 string.
 * @param {String} ImageURL this constains a atring base64
 * @param {boolean} flag the flag
 * @returns {String} this function returns the string with the path of the image already stored in cloudinary
 */
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

/**
 * @function b64toBlob 
 * @memberOf 0_global
 * @description This async function allows to store an image in clodinary from a base64 string.
 * @param {String} b64Data
 * @param {String} contentType
 * @param {String} sliceSize
 * @returns {String} this function returns the string with the path of the image already stored in cloudinary
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

/**
 * @function notverified 
 * @memberOf 0_global
 * @description This function is helpful when verifying an account of a recently registered user.
 */
function notverified() {
    if (location.search.length > 0)
    {
        let sarch = location.search.toString().replace(/\?/, "");
        window.history.replaceState(null, null, "/ArudinoScheme_PI/notverified.html");
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
        if (obj.tk !== undefined && obj.usr !== undefined)
        {
            $.ajax({
                method: "POST",
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                url: GlobalApisLocation + "userApis/activeaccount", //?x=123
                data: JSON.stringify({token: obj.tk, email: obj.usr}),
                beforeSend: function (data) {
                },
                success: function (data) {//                    console.log("ok");
                    console.log(data);
                    if (data.status === 2) {
                        location.href = "index.html";
                    } else {
                        allMessageXD(data);
                    }
                },
                error: function (errorx) {
                    console.log(errorx);
                }
            });
            console.log(obj);
        } else
        {
            allMessageXD({status: 3, information: "The parameters are not correct."});
        }
    }
}
