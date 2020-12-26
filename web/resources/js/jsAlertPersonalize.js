/** @namespace jsAlertPersonalize
 * @description Global hints for notifications, swallows and toastr
*/

/**
 * @file Global hints for notifications, swallows and toastr.
 * @author DÚVAL CARVAJA, JORGE MOLINA, ANTHONY PACHAY
 * @see <a href="jsAlertPersonalize.html">jsAlertPersonalize</a>
 */

/* global toastr */
/* global swal */

/**
 * @function loading
 * @memberOf jsAlertPersonalize
 * @description this function is in charge of presenting a gif or load spinner that is 
 * used to let the user know that a process is being performed by javascript.
 * @returns {undefined} this function has no returns.
 */
function loading() {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = '<div class="spinner-grow text-success" role="status"><span class="sr-only">Loading...</span></div>';
    swal({
        title: "Processing!",
        text: "Please wait...",
        content: containerLoading,
        button: false
    });
}

/**
 * @function successTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * succesfull state in the lower right side of the screen.
 * @param {JsonObject} obj This object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function successTo(obj) {
    toastr.success(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function errorTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * error state in the lower right side of the screen.
 * @param {JsonObject} obj This object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function errorTo(obj) {
    toastr.error(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function infoTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * info state in the lower right side of the screen.
 * @param {JsonObject} obj this object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function infoTo(obj) {
    toastr.info(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}
/**
 * @function warningTo
 * @memberOf jsAlertPersonalize
 * @description This small function allows to visualize a notification called "toastr" in 
 * warning state in the lower right side of the screen.
 * @param {JsonObject} obj this object contains the message to be displayed.
 * @returns {undefined} this function has no returns.
 */
function warningTo(obj) {
    toastr.warning(obj.message, obj.nameApplication, {
        positionClass: "toast-bottom-right",
        closeButton: true
    });
}

/**
 * @function alertAll
 * @memberOf jsAlertPersonalize
 * @description This function allows you to call the toastr notification [error, warning, susses] using an 
 * object as a parameter which contains a status attribute, allowing you to decide 
 * what type of notification to display
 * @param {JsonObject} obj Indique the status for decide that alert was to show and the message.
 * @returns {undefined} this function has no returns.
 */
function alertAll(obj) {
    switch (obj.status) {
        case 2:
            successTo({
                message: obj.information,
                nameApplication: (obj.tittle===undefined)?"EasyIoT":obj.tittle
            });
            break;
        case 3:
            warningTo({
                message: obj.information,
                nameApplication: (obj.tittle===undefined)?"EasyIoT":obj.tittle
            });
            break;
        case 4:
            errorTo({
                message: obj.information,
                nameApplication: (obj.tittle===undefined)?"EasyIoT":obj.tittle
            });
            break;
        case 1:
            infoTo({
                message: obj.information,
                nameApplication: (obj.tittle===undefined)?"EasyIoT":obj.tittle
            });
            break;
    }
}
/**
 * @function allMessageXD
 * @memberOf jsAlertPersonalize
 * @description This function allows you to call the toastr notification [error, warning, susses] using an 
 * object as a parameter which contains a status attribute, allowing you to decide 
 * what type of notification to display
 * @param {JsonObject} obj Indique the status for decide that alert was to show and the message.
 * @returns {undefined} this function has no returns.
 */
function allMessageXD(obj) {
    let nameAplication = "EasyIoT";
    console.log(obj);
    if (obj.status === 2)
    {
        toastr.success(obj.information, nameAplication, {
            positionClass: "toast-bottom-right",
            closeButton: true
        });
    } else {
        if (obj.status === 3)
        {
            toastr.warning(obj.information, nameAplication, {
                positionClass: "toast-bottom-right",
                closeButton: true
            });
        } else {
            toastr.error(obj.information, nameAplication, {
                positionClass: "toast-bottom-right",
                closeButton: true
            });
        }
    }
}