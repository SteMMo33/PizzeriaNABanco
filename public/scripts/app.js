


var headers = new Headers()

/*
    Mosta la pagina principale
*/
function showHome()
{
    console.log('showHome')
    document.getElementById('pageOrders').style.display='none';
    document.getElementById('pagePay').style.display='none';
    document.getElementById('pagePaid').style.display='none';

    document.getElementById('orderNo').value='';
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

/*
    Premuto bottone di ricerca ordine
*/
function pressSearchOrder()
{
    // Controllo che non sia vuoto
    var orderNo = document.getElementById('orderNo').value
    if (orderNo==""){
        alert("Numero non valido")
        return
    }

    document.querySelector("#waitOrderDivError").style.display='none'

    // Simulo ritardo con un tempo ..
    /* setTimeout(
        function(){
            console.log(orderNo)
            document.getElementById('ordersOrderNo').textContent = orderNo;
            showOrders();
        }, 3000
    ) */

    /*
	 * https://www.e-coop.it/virtualShop/rest/totem/getOrder?
	 * codOrder=336151&
     * numPitch=-1&idTotem=999&shopId=2602
	 */
    var url = getServer() + "getOrder?codOrder="+orderNo+
        "&numPitch=-1"+
        "&idTotem="+settings.totemId+
        "&shopId="+settings.shopId

    var divErr = document.querySelector("#waitOrderDivError")

    console.log("[order] Fetch URL: "+url)
    /*   headers.forEach( (x, y) => {
        console.log("# "+x+" - "+y)
    }) */
   	return fetch(url, { headers: headers })
       	.then( (response) => {
		 	console.log("Fetch .then > "+ typeof response)
			console.log(response)
            
            if (response.ok==false){
                divErr.textContent = "Errore: "+response.status + " - " +response.statusText
                divErr.style.display = 'block'
            }
            else {
				var j = response.json().then( (body) => {
					console.log("json .then >")
					console.log(body)
					var result = body[0]
				})
				.catch( (err) => {
					console.log("json .catch "+err)
                    divErr.textContent = "Err JSON: "+err
                    divErr.style.display = 'block'
                })
            }
        })
      	.catch( (err) => {
			console.error("fetch .catch")
			console.log(err)
            divErr.textContent = err
            divErr.style.display = 'block'
         return null;
		});
}

function showOrders()
{
    console.log('showOrders')
    document.getElementById('pageOrders').style.display='block';
    document.getElementById('pagePay').style.display='none';
}

function pay(type)
{
    var esito = document.getElementById('esitoPay')
    esito.textContent = '-'
    document.getElementById('pagePaid').style.display='block'
    document.getElementById('pagePay').style.display='none'
    // Simulo ritardo con un tempo ..
    setTimeout(
        function(){
            document.getElementById('esitoPay').textContent = 'Pagamento registrato'
            setTimeout(
                function(){
                    showHome()
                }, 5000
            )
        }, 3000
    )
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
    console.log("updatePage")
    // Cambia il titolo
    //document.querySelector('#negozioHeader').textContent = 
    //    settings.negozio + " - " + settings.mode
    //document.querySelector('#username').textContent = settings.username
    //document.querySelector('#password').textContent = settings.password
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
      settings = {
          negozio: 'Default',
          mode: MODE_STAGING
      }
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


function getServer()
{
    if (settings.mode==MODE_STAGING)
        return "https://staging.e-coop.it/virtualShop/rest/totem/";
    if (settings.mode==MODE_NORMAL)
        return "https://www.e-coop.it/virtualShop/rest/totem/";
    return "??"
}



function init() {
    console.log('init')

    settings = loadSettings();
    // updatePage()
}

// Inizializzazione indipendete dallo stato del serviceWorker
init();
