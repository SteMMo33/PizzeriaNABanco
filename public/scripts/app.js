
var ordine = new Array();
var orders = new Array();
var totaleOrdine = 0
var nOrdini = 0

/*
    Mosta la pagina principale
*/
function showHome(item)
{
    console.log('showHome '+item)
    document.getElementById('pageContatti').style.display='none';
    document.getElementById('pageOrdine').style.display='none';
    document.getElementById('pageHome').style.display='block';
    getMenuItems(item)
}


/**
 * Mostra la pagina con i contatti
 */
function showContatti()
{
    console.log('showContatti')
    document.getElementById('pageContatti').style.display='block';
    document.getElementById('pageHome').style.display='none';
    //document.getElementById('pageOrdine').style.display='none';
}


// Mostra la dlg con i settings
function showDlgSettings(){

    console.log("[showDlgSettings]")
    if (dlgSettings==null){
        console.error("dlgSettings non definito!")
        return
    }
    // Aggiorna i dati in dlg
    //document.querySelector('#dlgAddIdx').val = idx
    document.querySelector('#dlgAddNumero').textContent = "1"

    // Apre la dlg
    dlgSettings.open()
}


function showOrderDlg(e){
    console.log("[showOrderDlg]", e)
    if (dlgItemActions==null){
        console.error("dlgItemActions non definito!")
        return
    }
    // Cerca il dato idx dell'elemento LI parente
    var el = e.srcElement.parentNode
    console.log(el)
    nm = el.nodeName
    while(nm != 'LI'){
        el = el.parentElement
        nm = el.nodeName
        console.log(nm)
        if (nm=='HTML') return  // Non trovato
    }
    var idOrdine = el.getAttribute('idx')
    console.log("idOrdine: ", idOrdine)
    var ordine = orders[idOrdine]
    console.log("Ordine: ", ordine)

    // Aggiorna i dati in dlg
    document.querySelector('#dlgIdxOrder').value = idOrdine
    document.querySelector('#txtDlgNome').textContent = ordine.nome

    var txtOrdine = ""
    console.log(ordine.ordine)
    var objOrdine = JSON.parse(ordine.ordine)
    console.log(objOrdine)
    objOrdine.forEach(elemento => {
        if (typeof elemento.tipo === 'undefined')
            txtOrdine += "- "+elemento.qty+" x "+elemento.nome+"<br>"
        else
            txtOrdine += elemento.tipo+": <b>"+elemento.qty+" x " + elemento.nome+"</b><br>"
    });
    document.querySelector('#txtDlgOrdine').innerHTML = txtOrdine

    // Apre la dlg
    //var dlg = dlgAddToOrder[0]
    dlgItemActions.open()
}




function saveOrder(){
    console.log('[saveOrder]', ordine)

    // Controllo nome
    var nome = document.querySelector("#orderName").value;
    if(nome==""){
        M.toast({html:"Il nome è obbligatorio"});
        return;
    }
    ordine['nome']=nome

    var dbOrdini = firebase.firestore().collection("ordini")
    var id = Date.now().toString(); // dbOrdini.createId();

    // Scrittura record
    dbOrdini.doc(id).set({
        ordine: JSON.stringify(ordine), // "Ordine",
        nome: nome,
		data: firebase.firestore.FieldValue.serverTimestamp(),
        servito: false,
        totale: totaleOrdine
      })
      .then(
         function(){
            console.log("[saveOrder] OK")
            M.toast({html: "Ordine inviato correttamente"})
            // setTimeout( function(){ResetOrder(); showHome('pizze')}, 4000);
         }
      )
      .catch(
        function(error){
            console.error("[saveOrder] ", error)
        }
    );
  console.log('[saveOrder]')
}



async function getData()  {
    console.log("getData")
    try {
        var restaurant = {};

        // Get Restaurant Data
        var resRef = firebase.firestore().collection("menu");
        var resSnap = await resRef.get();
        // console.log(resSnap)
        resSnap.forEach((doc) => {
            console.log(doc.data())
        })
        getMenuItems("pizze")
        return restaurant
    } catch (e) {
        console.error(e)
        return {
            errorMsg: "Something went wrong. Please Try Again."
        }
    }
}



function getOrdini() {
    console.log("[+getOrdini] ")
    // Elimina elementi aggiunti precedentemente
    document.querySelectorAll('.itemAdded').forEach( e => e.remove())

    try {
        // var nOrdini = 0;
        var nElementi = 0;

        // Get Data
        var resRef = firebase.firestore().collection("ordini");
        resRef.get().then( /*async*/ (orderList) => {

            // console.log("orderList: ", orderList    // Nulla di leggibile

            orderList.forEach( addOrder)
            /*
                function(order){
                    // console.log("id: "+order.id)

                    var orderData = order.data();
                    console.log(orderData)
                    // console.log("servito: "+orderData.servito)

                    // Inserisce in lista con chiave id
                    orders[order.id]= orderData
                    ++nOrdini

                    var jsonOrder = orderData.ordine
                    if(typeof jsonOrder=='undefined')
                        jsonOrder = "{\"ordine\":[{\"nome\":\"Problema nei dati\",\"qty\":\"-\"}]}"
                    if(jsonOrder.startsWith("["))
                        jsonOrder = "{\"ordine\":"+jsonOrder+"}"

                    // console.log("json: ",jsonOrder)
                    var objOrdine = JSON.parse(jsonOrder)
                    objOrdine.ordine.forEach(
        
                        function(elemento){     // Per ogni elemento dell'ordine
                            console.log("elemento: ", elemento)
                            //console.log(firebase.firestore.FieldPath.documentId())

                            if (typeof elemento.tipo === 'undefined')
                                return

                            // Se l'elemento è una pizza lo inserisce in lista
                            if (elemento.tipo === 'pizze' || elemento.tipo === 'speciali'){

                                // Duplica l'elemento 'template'
                                var newEl = document.querySelector('#template').cloneNode(true);
                                newEl.classList.add('itemAdded')
                                newEl.setAttribute('idx', order.id)
                                newEl.onclick = showOrderDlg
                                newEl.querySelector('#templateRow').textContent = nOrdini
                                newEl.querySelector('#templateTitle').textContent = elemento.qty + " x " + elemento.nome
                            // var d = orderData.data.toDate().toLocaleString()
                            // newEl.querySelector('#templateDesc').textContent = orderData.nome + " - " + d
                                newEl.querySelector('#templatePrice').innerHTML = orderData.consegnaOra

                                newEl.style.display='block'
                                document.querySelector('#mainList').appendChild(newEl);

                                var n = Number(elemento.qty)
                                if (!isNaN(n)) nElementi += n
                            }
                        }
                    )
                }
            ) */

            document.querySelector('#menuTitle').textContent = "Ordini: "+nOrdini
        })
    } catch (e) {
        console.error(e)
        return {
            errorMsg: "Something went wrong. Please Try Again."
        }
    }
    console.log("[-getOrdini]")
}


function addOrdine(order){
    // console.log("id: "+order.id)

    var orderData = order.data();
    console.log(orderData)
    // console.log("servito: "+orderData.servito)

    // Inserisce in lista con chiave id
    orders[order.id]= orderData
    ++nOrdini

    var jsonOrder = orderData.ordine
    if(typeof jsonOrder=='undefined')
        jsonOrder = "{\"ordine\":[{\"nome\":\"Problema nei dati\",\"qty\":\"-\"}]}"
    if(jsonOrder.startsWith("["))
        jsonOrder = "{\"ordine\":"+jsonOrder+"}"

    // console.log("json: ",jsonOrder)
    var objOrdine = JSON.parse(jsonOrder)
    objOrdine.ordine.forEach(

        function(elemento){     // Per ogni elemento dell'ordine
            console.log("elemento: ", elemento)
            //console.log(firebase.firestore.FieldPath.documentId())

            if (typeof elemento.tipo === 'undefined')
                return

            // Se l'elemento è una pizza lo inserisce in lista
            if (elemento.tipo === 'pizze' || elemento.tipo === 'speciali'){

                // Duplica l'elemento 'template'
                var newEl = document.querySelector('#template').cloneNode(true);
                newEl.classList.add('itemAdded')
                newEl.setAttribute('idx', order.id)
                newEl.onclick = showOrderDlg
                newEl.querySelector('#templateRow').textContent = nOrdini
                newEl.querySelector('#templateTitle').textContent = elemento.qty + " x " + elemento.nome
            // var d = orderData.data.toDate().toLocaleString()
            // newEl.querySelector('#templateDesc').textContent = orderData.nome + " - " + d
                newEl.querySelector('#templatePrice').innerHTML = orderData.consegnaOra

                newEl.style.display='block'
                document.querySelector('#mainList').appendChild(newEl);

                var n = Number(elemento.qty)
                // if (!isNaN(n)) nElementi += n
            }
        }
    )
}


function doPrint(){
    var idxOrder = document.querySelector('#dlgIdxOrder').value
    alert("Print "+idxOrder)
}

function doNotifica(){
    var idxOrder = document.querySelector('#dlgIdxOrder').value
    alert("Notify "+idxOrder)
    displayNotification()
}


/**
 * Invia al server FCM la richiesta di notifica di ordine pronto
 * La richiesta è una fetch POST con i parametri richiesti da FCM
 * Link: https://firebase.google.com/docs/cloud-messaging/http-server-ref
 * 
 * Esempio:
 * curl -X POST --header "Authorization: key=<>" \
    --Header "Content-Type: application/json" \
    https://fcm.googleapis.com/fcm/send \
    -d "{\"to\":\"<>\",\"notification\":{\"body\":\"<>\"}"



    curl -X POST -H "Authorization: key=<Server Key>" \
   -H "Content-Type: application/json" \
   -d '{
    "data": {
        "notification": {
            "title": "FCM Message",
            "body": "This is an FCM Message",
            "icon": "/itwonders-web-logo.png",
        }
    },
    "to": "<DEVICE_REGISTRATION_TOKEN>"
    }' https://fcm.googleapis.com/fcm/send

 */
function sendNotificaPronto(){
    var data = {
               notification: {
                token: 	"recieverTokenHere",
                title: 	"messageTitleHere",
                message:"messageHere"
        // url:	"urlHere"(only if you want to implement click action)
            },
            to: "563548335074"
    }
    console.log(data)

    fetch(
        "https://fcm.googleapis.com/fcm/send", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "key=AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd"
            },
            body: JSON.stringify(data),
        }
    ).then((res) => {
        console.log(res)
        if (res.status==200){
            console.log("> notifica inviata !")
        }
        else if (res.status==401){
            console.log("> Non autorizzato !")
        }
        else {
            console.error("> Error: "+res.status)
        }
    })
}




function init() {
    console.log('init')

    // getOrdini("non")

    // Lettura e sincronizzazione con collection 'ordini'
    var resRef = firebase.firestore().collection("ordini");
    resRef.onSnapshot(
        function(snapshot){
            snapshot.docChanges().forEach(
                function(change){
                    console.log("!! changes: "+change.type)
                    // console.log("!! data: ",change.doc)
                    
                    addOrdine(change.doc)
                    // displayNotification()
                }
            )
        }
    )

    console.log('init end')
}


// Inizializzazione indipendente dallo stato del serviceWorker (TBV)
init();


/**
 * notifications.js:53 Uncaught (in promise) TypeError: Failed to execute 'showNotification' on 'ServiceWorkerRegistration': No active registration available on the ServiceWorkerRegistration.
    at notification (notifications.js:53)
    at displayNotification (notifications.js:15)
    at app.js:345
    at Array.forEach (<anonymous>)
    at Array.<anonymous> (app.js:339)
    at next (database.ts:2205)
    at async_observer.ts:58
 */