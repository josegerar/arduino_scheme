/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


getDataSession();
$(document).ready(function () {
//    loadProject();
//    let obj = {
//        status: 1,
//        information: " was joined",
//        tittle: "OnLine"
//    };
//    alertAll(obj);
});

function closemodalProjectDescriptor() {
    $('#modalProjectDescriptor').modal('hide');
}
function openmodalProjectDescriptor() {
    $('#modalProjectDescriptor').modal();
}


//function askConfirmation(evt) {
//    var msg = 'x<br>Si recarga la página perdera todos los datos ingresados.\n¿Deseas recargar la página?';
//    evt.returnValue = msg;
//    
//    evt.preventDefault();
//    console.log("recargame esta!");
//    return msg;
//}
//window.addEventListener('beforeunload', askConfirmation);