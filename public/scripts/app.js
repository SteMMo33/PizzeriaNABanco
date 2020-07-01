

var ordine = new Array()
var listaArticoli = new Array()

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
}


function showOrdine()
{
    console.log('showOrdine')
    if (ordine.length==0){
        M.toast({html: "Nessun elemento in ordine"})
        return
    }
    // Svuota
    document.querySelectorAll('.addedOrder').forEach( e => e.remove())
    // Riempie la pagina Ordine
    var template = document.querySelector('#templateOrdine');
    var list = document.querySelector('#mainListOrdine');
    ordine.forEach( function( val, idx){
        var newSub = document.querySelector('#templateOrdine').cloneNode(true);
        newSub.style.display='block'
        newSub.classList.add('addedOrder')
        newSub.querySelector('#templateOrdineTitle').textContent = val.nome
        newSub.querySelector('#templateOrdineNo').textContent = val.qty
        document.querySelector('#mainListOrdine').appendChild(newSub)
    })
    // Mostra pagina
    document.getElementById('pageOrdine').style.display='block';
    document.getElementById('pageHome').style.display='none';
}


function showDlgAddToOrder(e){
    console.log("[showDlgAddToOrder]")
    if (dlgAddToOrder==null){
        console.error("dlgAddToOrder non definito!")
        return
    }
    var p = e.srcElement.parentElement
    while(p.tagName!='LI'){
        p = p.parentElement
    }
    var idx = p.getAttribute('idx')
    var data = listaArticoli[idx]
    // Aggiorna i dati in dlg
    document.querySelector('#dlgAddIdx').val = idx
    document.querySelector('#dlgAddNumero').textContent = "1"
    document.querySelector('#dlgAddNome').textContent = data.nome
    // Apre dlg
    var dlg = dlgAddToOrder[0]
    dlg.open()
}

function aggiungi1(){
    var el = document.querySelector('#dlgAddNumero')
    var no = Number(el.textContent)
    no += 1
    el.textContent = no
}

function togli1(){
    var el = document.querySelector('#dlgAddNumero')
    var no = el.textContent
    if (no>1){
        no -= 1
        el.textContent = no
    }
}

function addToOrder(e){
    console.log("[addToOrder] ",e)

    var idx = document.querySelector('#dlgAddIdx').val
    var articolo = listaArticoli[idx]
    articolo['qty'] = document.querySelector('#dlgAddNumero').textContent

    ordine.push(articolo)
    updateBadge(ordine.length)

    M.toast({ html:"Da finire .."})
}

/* Mostra/nasconde pagina settings */
function showProperties(show){
    // document.querySelector('#pageSettings').style.display= (show=='1' ? 'block':'none')
}


function acceptProperties(){
    // Lettura campi della form
    var select = document.querySelector('#selectNegozio')
    settings.negozio = select.options[select.selectedIndex].value

    select = document.querySelector('#selectMode')
    settings.mode = select.options[select.selectedIndex].value

    settings.username = document.querySelector('#username').value
    settings.password = document.querySelector('#password').value
    settings.shopId = document.querySelector('#shopId').value
    settings.totemId = document.querySelector('#totemId').value

    // Salva le impostazioni
    saveSettings(settings)
    // Aggiorna la pagina
    updatePage()
    // Nsconde la pagina settings
    showProperties(0)
}


function updatePage(){
    console.log("updatePage - ToDo")
}

function updateBadge(n){
    var el = document.querySelector('#badge')
    if (n < 1)
        el.textContent = '-'
    else
        el.textContent = n
}


/* 
    Lettura settings in localStorage 
    I dati arrivano salvati in JSON e vengono
    convertiti in array
*/
function loadSettings(){
    console.log("loadSettings")
  // Guarda in LocalStorage se ci sono posti salvati
  let settings = localStorage.getItem('settings');
  if (settings) {
    try {
        settings = JSON.parse(settings);
    } catch (ex) {
        settings = {};
    }
  }
  // Dati di default se non trovati altri salvataggi in localStorage
  if (!settings || Object.keys(settings).length === 0) {
      // Valori default
  }
  return settings;
}


/* 
    Salvataggio dei settings in localStorage
    I dati arrivano in forma di array e vengono salvati in JSON
*/
function saveSettings(settings){
    console.log("saveSettings")
    const data = JSON.stringify(settings);
    localStorage.setItem('settings', data);
}


function sendEmail(){
    console.log('[sendEmail]')
    emailSubject = "Ordine Nuova Aurora"
    emailBody = "Ordine:\n1 cipolle + origano\n1 vetegale\n\nGrazie\n\n"
    window.location.href = "mailto:stefano.mora@libero.it?subject=" + emailSubject + "&body=" + emailBody
}


function saveOrder(){
    console.log('[saveOrder]', ordine)

    var dbOrdini = firebase.firestore().collection("ordini")
    const id = "11112"; // dbOrdini.createId();

    dbOrdini.doc(id).set({
        id: id,
        text: "Ordine",
        nome: "Stefano",
        data: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(
          function(){
              console.log("[saveOrder] OK")
              M.toast({html: "Ordine inviato correttamente"})

              ordine = new Array()
              updateBadge(0)
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


function waitData(submenu, item) {
    return firebase.firestore().collection("menu").doc(submenu).collection(item).get()
}

function InsertItem(datalist, item){
    // Titolo pagina
    console.log(item)
    if (item){
        var newSub = document.querySelector('#templateMenu').cloneNode(true);
        newSub.classList.add('itemAdded')
        newSub.querySelector('#submenuTitle').textContent = item
        newSub.style.display='block'
        document.querySelector('#mainList').appendChild(newSub);
    }

    datalist.forEach( dataraw => {
        var data = dataraw.data()
        // In Memoria
        var idx = listaArticoli.push(data) -1
        // A video
        var newEl = document.querySelector('#template').cloneNode(true);
        newEl.classList.add('itemAdded')
        newEl.setAttribute('idx', idx.toString())
        newEl.onclick = showDlgAddToOrder
        newEl.querySelector('#templateTitle').textContent = data.nome
        newEl.querySelector('#templateDesc').textContent = data.ingredienti
        newEl.querySelector('#templatePrice').innerHTML = "&euro; "+data.prezzo.toFixed(2)
        newEl.style.display='block'
        document.querySelector('#mainList').appendChild(newEl);
    })
}

function getMenuItems(item) {
    console.log("[getMenuItems] "+item)
    // Elimina elementi aggiunti precedentemente
    document.querySelectorAll('.itemAdded').forEach( e => e.remove())

    try {
        var items = {};

        // Get Data
        var resRef = firebase.firestore().collection("menu");
        resRef.doc(item).get().then( async(itemSnap) => {
            console.log(itemSnap.id, itemSnap.data())    // Nome sottomenu - es 'Pizze'
            if (itemSnap.data()==undefined){
                document.querySelector('#menuTitle').textContent = "Nessun dato"
                return
            }
            // Compone il titolo
            document.querySelector('#menuIcon').textContent = itemSnap.data().icona
            document.querySelector('#menuTitle').textContent = itemSnap.data().nome
            
            // Lista articoli
            listaArticoli = new Array()

            // Qeusti hanno un sottomenu
            if (item=='ristorante'){
                var r = await waitData("ristorante",'Antipasti');
                InsertItem( r, "Antipasti")

                r = await waitData("ristorante",'Primi piatti');
                InsertItem( r, 'Primi piatti')

                r = await waitData("ristorante",'Secondi');
                InsertItem( r, "Secondi piatti")

                r = await waitData("ristorante",'Contorni');
                InsertItem( r, "Contorni")

                r = await waitData("ristorante",'Dolci');
                InsertItem( r, "Dessert")
            }
            else if (item=='calzoni'){
                var r = await waitData('calzoni','calzoni');
                InsertItem( r, 'Calzoni')

                r = await waitData('calzoni','pizze alte');
                InsertItem( r, "Pizze alte")

            }
            else if (item=='bevande'){
                var r = await waitData('bevande','Bevande');
                InsertItem( r, 'Bevande')
                var r = await waitData('bevande','Dopo cena');
                InsertItem( r, 'Dopo cena')
                var r = await waitData('bevande','Lista dei vini');
                InsertItem( r, 'Lista dei vini')
            }
            else {
                // SubCollection 'stesso nome'
                resRef.doc(item).collection(item).get().then( (subitemSnap) => {
                    var idx = 0
                    subitemSnap.forEach( (subitem) => {
                        // console.log(subitem.data()) // Elemento
                        var data = subitem.data()
                        listaArticoli.push(data)

                        // Duplica l'elemento 'template'
                        var newEl = document.querySelector('#template').cloneNode(true);
                        newEl.classList.add('itemAdded')
                        newEl.setAttribute('idx', idx.toString())
                        newEl.onclick = showDlgAddToOrder
                        newEl.querySelector('#templateTitle').textContent = data.nome
                        newEl.querySelector('#templateDesc').textContent = data.ingredienti
                        newEl.querySelector('#templatePrice').innerHTML = "&euro; "+data.prezzo.toFixed(2)
                        newEl.style.display='block'
                        document.querySelector('#mainList').appendChild(newEl);
                        ++idx;
                    })

                    // console.log(listaArticoli)
                })
            }
        })
    } catch (e) {
        return {
            errorMsg: "Something went wrong. Please Try Again."
        }
    }

}


function init() {
    console.log('init')
//    settings = loadSettings();
    getMenuItems("speciali")
    console.log('init end')
}

// Inizializzazione indipendete dallo stato del serviceWorker
init();
