
var ordine = new Array()
var listaArticoli = new Array()
var totaleOrdine = 0

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
    document.getElementById('pageOrdine').style.display='none';
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
    //document.querySelector('#dlgAddNome').textContent = data.nome
    // Apre la dlg
    //var dlg = dlgAddToOrder[0]
    dlgSettings.open()
}


function showOrderDlg(){
    console.log("[showOrderDlg]")
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


function ResetOrder() {
    // Reset lista
    ordine = new Array()
    updateBadge(0)
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
        var orders = {};
        var nOrdini = 0;
        var nElementi = 0;

        // Get Data
        var resRef = firebase.firestore().collection("ordini");
        resRef.get().then( /*async*/ (orderList) => {

            // console.log("orderList: ", orderList    // Nulla di leggibile

            orderList.forEach(
                function(order){
                    //console.log("ID: ", order.getId())

                    var orderData = order.data();
                    console.log(orderData)
                    console.log(orderData.servito)

                    ++nOrdini

                    var jsonOrder = orderData.ordine
                    if(typeof jsonOrder=='undefined')
                        jsonOrder = "{\"ordine\":[{\"nome\":\"Problema nei dati\",\"qty\":\"-\"}]}"
                    if(jsonOrder.startsWith("["))
                        jsonOrder = "{\"ordine\":"+jsonOrder+"}"

                    // Duplica l'elemento 'template'
                    var newEl = document.querySelector('#template').cloneNode(true);
                    newEl.classList.add('itemAdded')

                    var d = orderData.data.toDate().toLocaleString()
                    newEl.querySelector('#templateTitle').textContent = orderData.nome + " @ " + d

                    newEl.querySelector('#templatePrice').innerHTML = "18:20"

                    // console.log("json: ",jsonOrder)
                    var objOrdine = JSON.parse(jsonOrder)
                    objOrdine.ordine.forEach(
        
                        function(elemento){     // Per ogni elemento dell'ordine
                            console.log("elemento: ", elemento)
                            //console.log(firebase.firestore.FieldPath.documentId())

                            var row = newEl.querySelector('#templateDesc').cloneNode(true)
                            row.textContent = " - " + elemento.nome + " x " + elemento.qty
                            newEl.appendChild(row)

                            if (typeof elemento.tipo === 'undefined')
                                return

                            // Se l'elemento è una pizza lo inserisce in lista
                            if (elemento.tipo === 'pizze' || elemento.tipo === 'speciali'){

                                // Duplica l'elemento 'template'
                                var newEl = document.querySelector('#template').cloneNode(true);
                                newEl.classList.add('itemAdded')
                                newEl.setAttribute('idx', "11112")
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
                    newEl.style.display='block'
                    document.querySelector('#mainList').appendChild(newEl);
                }
            )

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


function init() {
    console.log('init')
    getOrdini("non")
    console.log('init end')
}

// Inizializzazione indipendete dallo stato del serviceWorker
init();
