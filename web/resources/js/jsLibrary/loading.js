/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global toastr */

function loading() {
    let containerLoading = document.createElement('div');
    containerLoading.innerHTML = '<div class="spinner-grow text-success" role="status"><span class="sr-only">Loading...</span></div>';
    swal({
        title: "Procesing",
        text: "Please wait...",
        content: containerLoading,
        button: false
    });
}

function successTo(obj){
    toastr.success(obj.information, "EaCircuits App",{
       positionClass: "toast-bottom-right",
       closeButton: true
    });
}

function errorTo(obj){
    toastr.error(obj.information, "EaCircuits App",{
       positionClass: "toast-bottom-right",
       closeButton: true
    });
}

function warningTo(obj){
    toastr.warning(obj.information, "EaCircuits App",{
       positionClass: "toast-bottom-right",
       closeButton: true
    });
}


