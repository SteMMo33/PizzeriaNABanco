
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


Comunicazione con database
--------------------------
Firestore
Condivide il DB dell'app dei clienti


list() {
   return this.db.collection('/todos', ref => ref.orderBy('complete').orderBy('text')).valueChanges();
}


complete(todo) {
   return this.db.collection('todos').doc(todo.id).update({
     complete: todo.complete,
     updatedAt: firebase.firestore.FieldValue.serverTimestamp()
   });
}



Push notification
-----------------
L'applicazione deve poter ricevere notifiche di nuovi inserimenti di ordini attraverso
il meccanismo del Push notification.

Articolo:
https://www.codemag.com/Article/1901031/Implementing-Push-Notifications-in-Progressive-Web-Apps-PWAs-Using-Firebase


--

https://developers.google.com/web/ilt/pwa/introduction-to-push-notifications

The Web Push Protocol
Let's look at how to send a push message to the browser using the Web Push Protocol.

Server key: AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd
Sender ID: 563548335074

Sending a Message Using cURL
----------------------------
The cURL command that sends a request to FCM to issue a push message looks like this:

curl "ENDPOINT_URL" --request POST --header "TTL: 60" --header "Content-Length: 0" \
--header "Authorization: key=SERVER_KEY"

For example:

curl "https://android.googleapis.com/gcm/send/fYFVeJQJ2CY:APA91bGrFGRmy-sY6NaF8a...gls7HZcwJL4 \
LFxjg0y0-ksEhKjpeFC5P" --request POST --header "TTL: 60" --header "Content-Length: 0" \
 --header "Authorization: key=AIzaSyD1JcZ8WM1vTtH6Y0tXq_Pnuw4jgj_92yg"

curl "https://android.googleapis.com/gcm/send/AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd" --request POST --header "TTL: 60" --header "Content-Length: 0" \
 --header "Authorization: key=AIzaSyD1JcZ8WM1vTtH6Y0tXq_Pnuw4jgj_92yg"


Sending the message from the Server
-----------------------------------
In this section, we cover how to send a push message from the server.

---

PWA con notifiche da pizzeria

https://github.com/dotnet-presentations/blazor-workshop/blob/master/docs/09-progressive-web-app.md
Usa modulo .NET per ?

https://www.pushpro.io/blog/pwa-push-notifications-for-progressive-web-apps

https://developers.google.com/web/fundamentals/codelabs/push-notifications/

https://github.com/GwtMaterialDesign/gwt-material/wiki/PWA-:-Push-Notifications
https://dev.to/thisdotmedia/pwa-push-notifications-with-firebase-cloud-messaging-pt1-10ak
https://github.com/gokulkrishh/demo-progressive-web-app
https://github.com/devpato/pwa-notifications

---

Multihost

https://fireship.io/lessons/deploy-multiple-sites-to-firebase-hosting/

