
Progetto Nuova Aurora
=====================

Firebase
........
Creato su Firebase console il nuovo progetto 'Pizzeria Nuova Aurora'.

Aggiungi un web app -> 'Pizzeria Nuova Aurora App'
Registrata app 
Copia ed incollato codice proposto dalla registrazione

Nella cartella pwa ho eseguito:
* firebase login
* firebase init
** selezionato 'configure and deploy Firebase hosting sites'
** Avrebbe creato dei files iniziali
* Cambiato il valore di 'default' in .firebaserc perchè puntava ad altro progetto
* firebase deploy


Project Console: https://console.firebase.google.com/project/pizzeria-nuova-aurora/overview
Hosting URL: https://pizzeria-nuova-aurora.web.app


Nella barra in alto è apparsa un'icona/bottone stile 'download', 
premuta la quale è apparso il messaggio di richista di installazione dell'app - oppure
la richiesta di inserimento icone su desktop.
Premuto 'xxxx' è cominciata l'installazione sul cell.



Codice
------

TIP: To be installable, Chrome requires that you provide at least a 192x192px icon and a 512x512px icon. 
But you can also provide other sizes. 
Chrome uses the icon closest to 48dp, for example, 96px on a 2x device or 144px for a 3x device.
Chrome ha indicato che l'appplicazione poteva essere installata quando ho aggiunto l'icona 144x144.


Basic off-line experience: pagina custom con messaggio.

Aggiunto un bottone di nome 'butInstall' per gestire l'installazione della appcome previsto in install.js



Impostazioni
------------
I settings dell'applicazione vengono salvati in localStorage


Comunicazione con database
--------------------------
Firestore

Autenticazione utenti - Authentication
--------------------------------------


Menu laterale
-------------
https://github.com/slavanga/pusha

Stili:
https://github.com/unicodeveloper/pwa-commits/blob/master/public/css/style.css


Debug
-----
E' possibile vedere gli ouput di debug del browser del cellulare?


