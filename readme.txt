
Progetto Nuova Aurora Banco
===========================

Firebase
........
Creato su Firebase console il nuovo progetto 'Pizzeria Nuova Aurora'.

Aggiungi un web app -> 'Pizzeria NA Banco'
Registrata app 
Copia ed incollato codice proposto dalla registrazione

Nella cartella pwa ho eseguito:
* firebase login
* firebase init
** selezionato 'configure and deploy Firebase hosting sites'
** Avrebbe creato dei files iniziali
* Cambiato il valore di 'default' in .firebaserc perchè puntava ad altro progetto
* firebase deploy
firebase deploy --only hosting:pizzeria-na-banco


Project Console: https://console.firebase.google.com/project/pizzeria-nuova-aurora/overview
Hosting URL: https://pizzeria-na-banco.web.app


Nella barra in alto è apparsa un'icona/bottone stile 'download', 
premuta la quale è apparso il messaggio di richista di installazione dell'app - oppure
la richiesta di inserimento icone su desktop.
Premuta l'icona è cominciata l'installazione sul cell.

A2HS
----

To be served over HTTPs — the web is increasingly being moved in a more secure direction, and many modern web technologies (A2HS included) will work only on secure contexts.

To have a manifest file with the correct fields filled in, linked from the HTML head.
Standard *.webmanifest

To have an appropriate icon available for displaying on the Home screen.

Chrome additionally requires the app to have a service worker registered (e.g., so it can function when offline).





Comunicazione con database
--------------------------
Firestore
Condivide il DB dell'app dei clienti




RICEZIONE NOTIFICA NUOVO ORDINE
-------------------------------

Sembrano esserci due strade:
1. la app ordini salva l'ordine nel DB ed invia al server FCM una richiesta di invio notifica ai subscriber
2. la app ordini salva l'ordine nel DB e l'app banco installa una callback sulla modifica del DB Ordini

La 2. è OK, funziona sia sulla prima lettura che sulle successive modifiche !!



INVIO NOTIFICA ORDINE PRONTO
----------------------------
Invio messaggio al server FCM per invio notifica al subscriber

https://firebase.google.com/docs/cloud-messaging/http-server-ref
This document provides a reference for the HTTP syntax used to pass messages from your app server to client apps via Firebase Cloud Messaging.




Push notification
-----------------
L'applicazione deve poter ricevere notifiche di nuovi inserimenti di ordini attraverso
il meccanismo del Push notification.

Articolo:
https://www.codemag.com/Article/1901031/Implementing-Push-Notifications-in-Progressive-Web-Apps-PWAs-Using-Firebase
Interessante articolo che usa i servizi Google, in particolare Firebase Function



--

https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

The Web Push Protocol
---------------------
Let's look at how to send a push message to the browser using the Web Push Protocol.

Sending a Push Message Using Firebase Cloud Messaging



Sending a Message Using cURL
----------------------------
The cURL command that sends a request to FCM to issue a push message looks like this:

curl "ENDPOINT_URL" --request POST --header "TTL: 60" --header "Content-Length: 0" \
--header "Authorization: key=SERVER_KEY"


---

PWA con notifiche da pizzeria

https://github.com/dotnet-presentations/blazor-workshop/blob/master/docs/09-progressive-web-app.md
Usa modulo .NET per ?


https://developers.google.com/web/fundamentals/codelabs/push-notifications/

https://github.com/GwtMaterialDesign/gwt-material/wiki/PWA-:-Push-Notifications
https://dev.to/thisdotmedia/pwa-push-notifications-with-firebase-cloud-messaging-pt1-10ak
https://github.com/gokulkrishh/demo-progressive-web-app
https://github.com/devpato/pwa-notifications

https://www.itwonders-web.com/blog/push-notification-using-firebase-demo-tutorial
https://engineering.matrimony.com/fire-cloud-messaging.html

https://www.thinktecture.com/en/pwa/push-api/

---

Multihost

https://fireship.io/lessons/deploy-multiple-sites-to-firebase-hosting/



Stampa
------
Per la stampa dello scontrino uso una chiamata ad un servizio sulla macchina di sviluppo
la quale esegue la chiamata PrintJob dello standard IPP

Modifica: la Raspberry fa da printer server, l'app deve puntare all'IP del Raspberry

TODO: stato affidabile, specie per la fine carta.


Note: Fetch supports the Cross Origin Resource Sharing (CORS). Testing generally requires running a local server. 
Note that although fetch does not require HTTPS, service workers do and so using
 fetch in a service worker requires HTTPS. Local servers are exempt from this.



Apache HTTPs
------------

Chiave privata
#openssl genrsa -out ca.key 2048

Richiesta certificato
#openssl req -new -key ca.key -out ca.csr

Certificato firmato
openssl x509 -req -days 365 -in ca.csr -signkey ca.key -out ca.crt

cp ca.crt /etc/pki/tls/certs
cp ca.key /etc/pki/tls/private/ca.key
cp ca.csr /etc/pki/tls/private/ca.csr

#vi /etc/httpd/conf.d/ssl.conf
................
SSLCertificateFile /etc/pki/tls/certs/ca.crt
SSLCertificateKeyFile /etc/pki/tls/private/ca.key
