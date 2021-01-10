"use strict";
var url = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + "/eacircuitsserver/ws_sharing",
        webSocket = new WebSocket(url);

//console.log(window.location);
console.log(url);
webSocket.onopen = onOpen;
webSocket.onclose = onClose;
webSocket.onmessage = onMessage;
webSocket.onerror = function (event) {
    console.error("Error en el WebSocket detectado:");
    console.log(event);
};

function onOpen() {
    console.log("conectado...");
//    var dataUser = store.session.get("usereacircuits");
//    if (dataUser !== undefined && dataUser !== null)
//    {
//        
//    }else
//    {
////        location.href = "";
//    }
}
function onClose(evt) {
    console.log("Desconectado...");
    console.log(evt);
}

function MessageSend(obj) {
    //console.log("enviando...");
    let objmsg = JSON.stringify(obj);
    if (objmsg.length <= 10000450)
    {
        webSocket.send(objmsg);
      //  console.log("enviand mensaje:sock");
        //console.log(obj);
    } else {
        alertAll({status: 4, information: "The message exceeds the limit."});
    }
}
function onMessage(evt) {
    var obj = JSON.parse(evt.data);
    console.log(obj);
    if (obj.config === "graph")
    {
        updateSystem(obj.content);
    } else if (obj.config === "codeJson")
    {
        sendJsonCode(obj.content);
    } else if (obj.config === "chat")
    {
        angular.element($('[ng-controller="controllerWork"]')).scope().setListchat(JSON.parse(obj.content));
    } else if (obj.config === "list")
    {
        console.log("s");
        angular.element($('[ng-controller="controllerWork"]')).scope().setListOnline(JSON.parse(obj.content));
    } else if (obj.config === "join")
    {
        let objx = {
            status: 1,
            information: obj.content + " has joined.",
            tittle: "On Line Work"
        };
        alertAll(objx);
    } else if (obj.config === "close")
    {
        let objx = {
            status: 1,
            information: obj.content + " has been disconnected.",
            tittle: "On Line Work"
        };
        alertAll(objx);
    } else if (obj.config === "error")
    {

    }
}