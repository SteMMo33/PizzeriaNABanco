
var ordine = new Array();
var orders = new Array();
var totaleOrdine = 0
var nOrdini = 0
var idOrdineSel = 0     // ID ordine selezionato

/*
    Mosta la pagina principale
*/
function showHome(item)
{
    console.log('showHome '+item)
    //document.getElementById('pageContatti').style.display='none';
    //document.getElementById('pageOrdine').style.display='none';
    document.getElementById('pageHome').style.display='block';
    getMenuItems(item)
}


/**
 * Mostra la pagina con i contatti
 */
function showContatti()
{
    console.log('showContatti')
    //document.getElementById('pageContatti').style.display='block';
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
    console.log("[showOrderDlg]")
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

    var orderData = order.data();
    console.log(orderData)

    // Inserisce in lista orders con chiave id
    orders[order.id]= orderData
    ++nOrdini

    var jsonOrder = orderData.ordine
    if(typeof jsonOrder=='undefined')
        jsonOrder = "{\"ordine\":[{\"nome\":\"Problema nei dati\",\"qty\":\"-\"}]}"
    if(jsonOrder.startsWith("["))
        jsonOrder = "{\"ordine\":"+jsonOrder+"}"

    // console.log("json: ",jsonOrder)
    var objOrdine = JSON.parse(jsonOrder)
    orders[objOrdine] = objOrdine
    objOrdine.ordine.forEach(

        function(elemento){     // Per ogni elemento dell'ordine
            //console.log("elemento: ", elemento)
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
                // newEl.querySelector('#templateRow').textContent = nOrdini
                newEl.querySelector('#templateTitle').textContent = elemento.qty + " x " + elemento.nome
                newEl.querySelector('#templateNome').textContent = orderData.nome
                newEl.querySelector('#templateOra').innerHTML = orderData.consegnaOra

                newEl.style.display='block'
                document.querySelector('#mainList').appendChild(newEl);

                // var n = Number(elemento.qty)
                // if (!isNaN(n)) nElementi += n
            }
            else console.log("Tipo non previsto: ", elemento.tipo)
        }
    )
    document.querySelector('#menuTitle').textContent = "Ordini da evadere OGGI"
}


/** Stampa IPP
 * RFC8010
  */
function doPrintIpp(){
    var idxOrder = document.querySelector('#dlgIdxOrder').value
    // var ordine = orders[idxOrder]
    // L'ordine selezionato è in 'ordine
    console.log("[print] ", ordine.nome)
    console.log("[print] ", ordine.objOrdine)

    /* Da comando ippfind ricevo:
        ipp://GhilbaDebian.local:631/printers/CUSTOM_Engineering_Q3
    */
    var printer = 'CUSTOM_Engineering_Q3'

    /*  IPP uses HTTP as its transport protocol. 
        Each IPP request is a HTTP POST with a binary IPP message and print file, if any, in the request message body. 
        The corresponding IPP response is returned in the POST response. 
        HTTP connections can be unencrypted, upgraded to TLS encryption using an HTTP OPTIONS request, or encrypted immediately (HTTPS). 
        HTTP POST requests can also be authenticated using any of the usual HTTP mechanisms.
    */

    /* Test con stampa http - da parametrizzare */
    var ip = "127.0.0.1" // "localhost"
    var port = 631
    var text = "Prova di stampa\nProva di stampa"
    var bText = new TextEncoder().encode(text);
    console.log("bText: ", bText)

    var reqBody1 = [ 0x01, 0x01,    // IPP version
        0x00, 0x02,                 // Print-job request
        0x00, 0x00, 0x00, 0x50,     // Arbitrary request ID
        0x45, 0x00, 0x0B, 'p','r','i','n','t','e','r','-','u','r','i',
            0x00, 59, 'i','p','p',':','/','/','l','o','c','a','l','h','o','s','t',':','6','3','1','/','p','r','i','n','t','e','r','s','/','C','U','S','T','O','M','_','E','n','g','i','n','e','e','r','i','n','g','_,','Q','3',
        0x03                        // end-of-attributes-tag
    ]                      
    reqBody1.push(bText)

    console.log("reqBody1: ", reqBody1)
    
    var reqBody = new Uint8Array(reqBody1)
    /* ATTR uri "printer-uri" "ipp://printer.example.com/ipp/print"
    0x45                           uri type             value-tag
    0x000b                                              name-length
    printer-uri                    printer-uri          name
    0x002c                                              value-length
    ipp://printer.example.com/ipp/ printer pinetree     value
    print/pinetree

    Stampa di prova: localhost - - [08/Dec/2020:17:53:52 +0100] "POST /printers/CUSTOM_Engineering_Q3 HTTP/1.1" 200 397 Print-Job successful-ok

    */

    console.log(typeof reqBody)
    console.log("reqBody: ", reqBody)

    console.log('http://'+ip+':'+port+'/printers/'+printer)
    fetch('http://'+ip+':'+port+'/printers/'+printer, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Content-Type': 'application/ipp'
          },
        body: reqBody
        })
    .then(response => {
        console.log(response)
        M.toast({html: "Stampa eseguita"})
    })
    .catch(response => console.error(response))
}


/** 
 * Stampa via printer server sulla stessa sottorete
  */
 function doPrint(){
    var idxOrder = document.querySelector('#dlgIdxOrder').value
    // var ordine = orders[idxOrder]
    // L'ordine selezionato è in 'ordine
    console.log("[print] ", ordine.nome)
    console.log("[print] ", ordine.objOrdine)

    /* Test con stampa http - da parametrizzare */
    var ip = "192.168.1.124" // "127.0.0.1" // "localhost"
    var reqBody = {
        nome: ordine.nome,
        ora: ordine.consegnaOra,
        ordine: ordine.objOrdine
    }

    console.log("reqBody: ", reqBody)

    console.log('http://'+ip+'/stampa.php')
    fetch('http://'+ip+':'+'/stampa.php', {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody)
    })
    .then(response => {
        console.log(response)
        M.toast({html: "Stampa eseguita"})
    })
    .catch(response => {
        console.error(response)
        M.toast({html: "Errore "+response})
    })
}


/**
 * Chiede conferma
 */
function doChiudiOrdine(){
    dlgSicuro.open();
    console.log("> Dopo sicuro")
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
            M.toast({html: "Ordine chiuso correttamente"})
            setTimeout( function(){dlgItemActions.close()}, 4000);
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
                "Authorization": "Bearer AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd"
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

    var jsonOrdine = ordine.ordine
    var arrOrdine = JSON.parse(jsonOrdine)
    var numero = 0
    arrOrdine.forEach( (el, idx) => {
        numero += Number(el.qty)
    })
    var data = {
        data: {
            notification: {
                title: 	"Pizzeria Nuova Aurora",
                body:"Pizza è quasi pronta !! Ti aspettiamo",
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
                "Authorization": "key=AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd"
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



function init() {
    console.log('init')

    // getOrdini("non")
    var found = false

    // Lettura e sincronizzazione con collection 'ordini'
    var now = new Date()
    var data = now.getFullYear().toString()+(now.getMonth()+1).toString().padStart(2,'0')+now.getDate().toString().padStart(2,'0')
    console.log("Filtro per: ", data)

    var resRef = firebase.firestore().collection("ordini").where("consegnaData","==", data).where("servito","==",false).orderBy("consegnaOra");
    resRef.onSnapshot(
        function(snapshot){
            snapshot.docChanges().forEach(
                function(change){
                    console.log("!! changes: ", change)
                    // console.log("!! data: ",change.doc)
                    if (change.type=='added'){
                        addOrdine(change.doc)
                        found = true
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

    console.log('init end')
}


// Inizializzazione indipendente dallo stato del serviceWorker (TBV)
init();

