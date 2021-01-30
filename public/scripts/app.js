var cfg = []
var ordine = new Array();
var orders = new Array();
var totaleOrdine = 0
var nOrdini = 0
var idOrdineSel = 0     // ID ordine selezionato
var bearer              // autenticazione per notifiche

/*
    Mosta la pagina principale
*/
function showHome()
{
    console.log('showHome ')
    document.getElementById('pageHome').style.display='block';
}


/**
 * Mostra la pagina con i contatti
 */
function showContatti()
{
    console.log('showContatti')
    document.getElementById('pageHome').style.display='none';
}


// Mostra la dlg con i settings
function showDlgSettings(){

    console.log("[showDlgSettings]")
    if (dlgSettings==null){
        console.error("dlgSettings non definito!")
        return
    }
    // Aggiorna i dati in dlg
    document.querySelector('#cfgIpStampante').value = cfg['ipStampante']
    document.querySelector('#cfgPizze').checked = cfg['rxPizze']
    document.querySelector('#cfgRistorante').checked = cfg['rxCucina']
    document.querySelector('#cfgBevande').checked = cfg['rxBevande']
    // Apre la dlg
    dlgSettings.open()
}


function showOrderDlg(e){
    console.log("[showOrderDlg]")
    if (dlgItemActions==null){
        console.error("dlgItemActions non definito!")
        return
    }
    // Cerca il dato idx dell'elemento LI genitore
    var el = e.srcElement.parentNode
    nm = el.nodeName
    while(nm != 'LI'){
        el = el.parentElement
        nm = el.nodeName
        // console.log(nm)
        if (nm=='HTML') return  // Non trovato
    }
    idOrdineSel = el.getAttribute('idx')
    console.log("idOrdineSel: ", idOrdineSel)
    
    ordine = orders[idOrdineSel]
    console.log("Ordine: ", ordine)

    // Aggiorna i dati in dlg
    document.querySelector('#dlgIdxOrder').value = idOrdineSel
    document.querySelector('#txtDlgNome').textContent = ordine.nome
    document.querySelector('#btnNotifica').style.display = ordine.token ? "block" : "none"

    var txtOrdine = ""
    console.log(ordine.ordine)
    var objOrdine = JSON.parse(ordine.ordine)
    ordine.objOrdine = objOrdine
    console.log(objOrdine)

    objOrdine.forEach(elemento => {
        if (typeof elemento.tipo === 'undefined')
            txtOrdine += "- "+elemento.qty+" x "+elemento.nome+"<br>"
        else
            txtOrdine += elemento.tipo+": <b>"+elemento.qty+" x " + elemento.nome+"</b><br>"
    });
    document.querySelector('#txtDlgOrdine').innerHTML = txtOrdine

    // Apre la dlg
    dlgItemActions.open()
}



/*
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
*/



function _getOrdini() {
    console.error("[+getOrdini] ")
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

    var orderData = order.data();
    console.log("[addOrdine] ",orderData)

    // Inserisce in lista orders con chiave id
    orders[order.id] = orderData
    ++nOrdini

    var jsonOrder = orderData.ordine
    if(typeof jsonOrder=='undefined')
        jsonOrder = "{\"ordine\":[{\"nome\":\"Problema nei dati\",\"qty\":\"-\"}]}"
    if(jsonOrder.startsWith("["))
        jsonOrder = "{\"ordine\":"+jsonOrder+"}"

    // console.log("json: ",jsonOrder)
    var objOrdine = JSON.parse(jsonOrder)
    objOrdine.ordine.forEach(

        function(elemento){     // Per ogni elemento dell'ordine arrivato
            //console.log("elemento: ", elemento)

            if (typeof elemento.tipo === 'undefined')
                return

            // Se l'elemento è una pizza lo inserisce in lista
            if (elemento.tipo === 'pizze' || elemento.tipo === 'speciali'){

                // Duplica l'elemento 'template'
                var newEl = document.querySelector('#template').cloneNode(true);
                newEl.classList.add('itemAdded')
                newEl.setAttribute('idx', order.id)
                newEl.setAttribute('h', orderData.consegnaOra)
                newEl.onclick = showOrderDlg
                // newEl.querySelector('#templateRow').textContent = nOrdini
                newEl.querySelector('#templateTitle').textContent = elemento.qty + " x " + elemento.nome
                newEl.querySelector('#templateNome').textContent = orderData.nome
                newEl.querySelector('#templateOra').innerHTML = orderData.consegnaOra
                newEl.style.display='block'

                var added = false
                var list = document.querySelectorAll('.itemAdded')
                if (list.length > 1){
                    var index = 0
                    while( index < list.length){
                        var item = list[index]
                        if (orderData.consegnaOra < item.getAttribute("h")){
                            item.insertAdjacentElement('beforebegin',newEl)
                            added = true
                            break
                        }
                        ++index
                    }
                }
                else 
                    document.querySelector('#mainList').appendChild(newEl);

                if(added==false)    document.querySelector('#mainList').appendChild(newEl);

                // var n = Number(elemento.qty)
                // if (!isNaN(n)) nElementi += n
            }
            else console.log("Tipo non previsto: ", elemento.tipo)
        }
    )
    document.querySelector('#menuTitle').textContent = "Ordini da evadere OGGI"
}



/** 
 * Stampa via printer server sulla stessa sottorete
 * Richiama lo script stampa.php
 * La stampa via IPP poneva un problema CORS
 */
 function doPrint(){

    // L'ordine selezionato è in 'ordine'
    console.log("[print] ", ordine.objOrdine)

    /* Test con stampa http - da parametrizzare */
    var ip = cfg['ipStampante'] // "192.168.1.124"
    var reqBody = {
        nome: ordine.nome,
        ora: ordine.consegnaOra,
        ordine: ordine.objOrdine,
        printer: ip
    }

    console.log("reqBody: ", reqBody)

    var url = 'https://stampa-na.herokuapp.com/'
    fetch( url, {
        method: 'POST',
        //mode: 'no-cors', Con questo la risposta è 'opaque'
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    .then(response => {
        console.log("[doPrint1] ",response)
        if(response.status==200){
            // return response.json()
            response.json().then( (r) => {
                    console.log("[doPrint2] ",r);
                M.toast({html: "Stampa eseguita"})
        
                // Rende visibile l'icona stampato
                document.querySelectorAll("li[idx='"+idOrdineSel+"'] #templatePrint").forEach( 
                    (x) => { x.style.display = "block" }
                )
                // Torna alla home
                setTimeout( () => dlgItemActions.close(), 1500 )
            })
        }
        else
            M.toast({html: "Errore"})
    })
    .catch(response => {
        console.error(response)
        M.toast({html: "Err: "+response+" - "+url})
    })
}


/**
 * Chiede conferma della chiusura ordine
 */
function doChiudiOrdine(){
    console.log("Chiudi? ", idOrdineSel)
    dlgSicuro.open();
    console.log("> Dopo open sicuro")
}

/**
 * Scrive in DB il flag servito per l'ordine corrente 'ordine'
 */
function chiudiOrdine(){

    var dbOrdini = firebase.firestore().collection("ordini")
    var id = idOrdineSel;

    // Scrittura record
    dbOrdini.doc(id).update({
        servito: true,
    })
    .then(
         function(){
            console.log("[doChiudiOrdine] OK")

            // Tolgo la riga a video
            var el = document.querySelectorAll("li[idx='"+id+"']")
            el.forEach( li =>  li.remove())
            // Tolgo il record in memoria
            delete orders[id]
            --nOrdini
            if (nOrdini==0)
                document.querySelector('#menuTitle').textContent = "Nessun ordine"

            M.toast({html: "Ordine chiuso correttamente"})
            setTimeout( function(){dlgItemActions.close()}, 2000);
         }
    )
    .catch(
        function(error){
            console.error("[doChiudiOrdine] ", error)
        }
    );
}


/**
 * Invia al server FCM la richiesta di notifica di ordine pronto
 * La richiesta è una fetch POST con i parametri richiesti da FCM
 * Link: https://firebase.google.com/docs/cloud-messaging/http-server-ref
 * 
    On success:
    {
      "name":"projects/myproject-b5ae1/messages/0:1500415314455276%31bd1c9631bd1c96"
    }

 */
function sendNotificaProntoV1(){
    var data = {
        message: {
            token: 	"fh_24D06e6VpP-il_9zby1:APA91bGQkEA3mDA3PCLMdsmdy_qixqYPcbq9J1mXDnbiyAWwZQOi1XPJNaXwIrT1JekqMLYxm8c7OJnt6jYt3s9fHBPBHYqQQ0o49RIeFXp_QoqIxmIvrTxNA-QOLCZ6pXwSFdhmYzUc",
            notification: {
                title: 	"Notifica da Banco",
                message:"Pizza è quasi pronta !!"
            },
        }
    }
    console.log(data)
    console.log(JSON.stringify(data))

    fetch( "https://fcm.googleapis.com/v1/projects/pizzeria-nuova-aurora/messages:send", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+bearer  
            },
            body: JSON.stringify(data),
        }
    ).then((res) => {
        console.log(res)
        if (res.status==200){
            console.log("> notifica inviata !")
            M.toast({html:"Notifica inviata !"});
        }
        else if (res.status==401){
            console.error("> Non autorizzato !")
            M.toast({html:"Err: non autorizzato"});
        }
        else {
            console.error("> Error: "+res.status)
            M.toast({html:"Errore: "+res.status});
        }
    })
}


/* OK Notifica senza autorizzazione */
function sendNotificaPronto(){
/*
    var jsonOrdine = ordine.ordine
    var arrOrdine = JSON.parse(jsonOrdine)
    var numero = 0
    arrOrdine.forEach( (el, idx) => {
        numero += Number(el.qty)
    })
*/
    var data = {
        data: {
            notification: {
                title: 	"Pizzeria Nuova Aurora",
                body:"🍕 Pizza è quasi pronta !! 🍕 Ti aspettiamo",
                icon: "/images/icons/logo128.png",
                color: "#ff0000"
            },
        },
        to: ordine.token
    }
    // console.log(data)
    console.log(JSON.stringify(data))

    fetch( "https://fcm.googleapis.com/fcm/send", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "key="+bearer
            },
            body: JSON.stringify(data),
        }
    ).then((res) => {
        console.log(res)
        if (res.status==200){
            console.log("> notifica inviata !")
            M.toast({html:"Notifica inviata !"});
        }
        else if (res.status==401){
            console.error("> Non autorizzato !")
            M.toast({html:"Errore: non autorizzato"});
        }
        else {
            console.error("> Error: "+res.status)
            M.toast({html:"Errore: "+res.status});
        }
    })
}


/* OK Notifica di ricevuto dal banco */
function sendNotificaRicevuto(ordine, id){

    //console.log("Ordine id: "+id);
    //console.log("Token: "+ordine.token);

    var data = {
        data: {
            notification: {
                title: 	"Pizzeria Nuova Aurora",
                body:"🍕 L'ordine è stato ricevuto! Grazie!\nTi invieremo un'altra notifica quando le pizze saranno pronte .. a dopo!",
                icon: "/images/icons/logo128.png",
                color: "#ff0000"
            },
        },
        to: ordine.token
    }
    // console.log(data)
    console.log(JSON.stringify(data))

    fetch( "https://fcm.googleapis.com/fcm/send", 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "key="+bearer
            },
            body: JSON.stringify(data),
        }
    ).then((res) => {
        console.log(res)
        if (res.status==200){
            console.log("> notifica ricevuto inviata")
            M.toast({html:"Notifica ordine ricevuto inviata"});

            // Aggiorna il flag su DB remoto
            console.log("Aggiornamento id: "+id)
            var dbOrdini = firebase.firestore().collection("ordini")
            dbOrdini.doc(id).update({
                notifBanco: true,
            })
            .then(
                 function(){
                    console.log("[sendNotificaRicevuto] OK")
                 }
            )
            .catch(
                function(error){
                    console.error("[sendNotificaRicevuto] ", error)
                }
            );        
        }
        else if (res.status==401){
            console.error("> Non autorizzato !")
            M.toast({html:"Errore: non autorizzato"});
        }
        else {
            console.error("> Error: "+res.status)
            M.toast({html:"Errore: "+res.status});
        }
    })
}


function getSettings() {
    let tmp = localStorage.getItem('ipStampante');
    cfg['ipStampante'] = tmp ? tmp : "192.168.1.65"

    tmp = localStorage.getItem('rxPizze');
    cfg['rxPizze'] = tmp ? tmp : "1"
    tmp = localStorage.getItem('rxCucina');
    cfg['rxCucina'] = tmp ? tmp : "0"
    tmp = localStorage.getItem('rxBevande');
    cfg['rxBevande'] = tmp ? tmp : "0"

    console.log("cfg: ", cfg)
}


function saveCfg(){
    console.log("[saveCfg]")

    let tmp = document.querySelector('#cfgIpStampante').value
    localStorage.setItem('ipStampante', tmp)
    cfg['ipStampante'] = tmp;

    tmp = document.querySelector('#cfgPizze').checked
    localStorage.setItem('rxPizze', tmp)
    cfg['rxPizze'] = tmp

    tmp = document.querySelector('#cfgBevande').checked
    localStorage.setItem('rxBevande', tmp)
    cfg['rxBevande'] = tmp

    tmp = document.querySelector('#cfgRistorante').checked
    localStorage.setItem('rxCucina', tmp)
    cfg['rxCucina'] = tmp
}

function init() {
    console.log('init')

    getSettings()
    getOrdini()
}


function getOrdini() {
    var found = false

    // Lettura settings
    var resRef = firebase.firestore().collection("settings").doc("set").get().then(
        (doc) => {
            if (doc.exists) {
                var data = doc.data();
                bearer = data['Bearer']
                // console.log("B: "+bearer)
            }
        }
    )


    // Lettura e sincronizzazione con collection 'ordini'
    var now = new Date()
    var data = now.getFullYear().toString()+(now.getMonth()+1).toString().padStart(2,'0')+now.getDate().toString().padStart(2,'0')
    console.log("Filtro per: ", data)

    var resRef = firebase.firestore().collection("ordini").where("consegnaData","==", data).where("servito","==",false).orderBy("consegnaOra");
    resRef.onSnapshot(
        function(snapshot){
            snapshot.docChanges().forEach(
                function(change){
                    console.log("> changes: ", change)
                    // console.log("!! data: ",change.doc)
                    if (change.type=='added'){
                        addOrdine(change.doc)
                        found = true

                        // Verifica se inviare la notifica ricevuto
                        var data = change.doc.data()
                        if (!data.notifBanco){
                            sendNotificaRicevuto(data, change.doc.id);
                        }
                    }
                    else if (change.type=='modified'){
                        console.log("! modified - ToDo")
                        //addOrdine(change.doc)
                    }
                    else if (change.type=='removed'){
                        console.log("! removed - ToDo - ", change.data)
                    }
                }
            )
        }
    )
    setTimeout( () => {
        if (!found) document.querySelector('#menuTitle').textContent = "Ancora nessun ordine"
    }, 2000)

    console.log('getOrdini end')
}


// Inizializzazione indipendente dallo stato del serviceWorker (TBV)
init();

