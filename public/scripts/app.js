


/*
    Mosta la pagina principale
*/
function showHome(item)
{
    console.log('showHome '+item)
    document.getElementById('pageContatti').style.display='none';
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


function showOrders()
{
    console.log('showOrders')
    document.getElementById('pageOrders').style.display='block';
    document.getElementById('pagePay').style.display='none';
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
        var newEl = document.querySelector('#template').cloneNode(true);
        newEl.classList.add('itemAdded')
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
                document.querySelector('#menuTitle').textContent = 'Nessun dato'
                return
            }
            document.querySelector('#menuTitle').textContent = itemSnap.data().nome
            
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
            else {
            // SubCollection 'stesso nome'
            resRef.doc(item).collection(item).get().then( (subitemSnap) => {
                subitemSnap.forEach( (subitem) => {
                    console.log(subitem.data()) // Elemento
                    var data = subitem.data()

                    // Duplica l'elemento 'template'
                    var newEl = document.querySelector('#template').cloneNode(true);
                    newEl.classList.add('itemAdded')
                    newEl.querySelector('#templateTitle').textContent = data.nome
                    newEl.querySelector('#templateDesc').textContent = data.ingredienti
                    newEl.querySelector('#templatePrice').innerHTML = "&euro; "+data.prezzo.toFixed(2)
                    newEl.style.display='block'
                    document.querySelector('#mainList').appendChild(newEl);
                })
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

//    getData()
  getMenuItems("pizze")

    // updatePage()
    console.log('init end')
}

// Inizializzazione indipendete dallo stato del serviceWorker
init();
