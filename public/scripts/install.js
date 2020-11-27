
'use strict';

let deferredInstallPrompt = null;

const installButton = document.getElementById('butInstall');
installButton.addEventListener('click', installPWA);



// Add event listener for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

// Add event listener for appinstalled event
window.addEventListener('appinstalled', logAppInstalled);


self.addEventListener('notificationclick', function(e) {
	var notification = e.notification;
	var primaryKey = notification.data.primaryKey;
	var action = e.action;
	console.log("> notificationclick")
 
	if (action === 'close') {
	  notification.close();
	} else {
	  clients.openWindow('http://www.example.com');
	  notification.close();
	}
 });



/**
 * Gestore eventi 'push'
 */
self.addEventListener('push', function(e) {
	console.log("> push")
	  
	var body;

	if (e.data) {
		body = e.data.text();
	} else {
		body = 'Push message no payload';
	}
  
  var options = {
    body: 'This notification was generated from a push!',
    icon: './images/icons/logo256.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {action: 'explore', title: 'Explore',  icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close',  icon: 'images/xmark.png'},
    ]
  };

  e.waitUntil(
    self.registration.showNotification('Hello world!', options)
  );
});



/**
 * Event handler for beforeinstallprompt event.
 *   Saves the event & shows install button.
 * @param {Event} evt
 */
function saveBeforeInstallPromptEvent(evt) {
  // alert("App può essere installata!")
  console.log('[install] saveBeforeInstallPromptEvent')
  // Save event & show the install button.
  deferredInstallPrompt = evt;
  installButton.removeAttribute('hidden');
}


/**
 * Event handler for butInstall - Does the PWA installation.
 * A2HS = Add to Home Screen
 * @param {Event} evt
 */
function installPWA(evt) {
  // Add code show install prompt & hide the install button.
  deferredInstallPrompt.prompt();
  installButton.setAttribute('hidden',true);

  // Log user response to prompt.
  deferredInstallPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt', choice);
      } else {
        console.log('User dismissed the A2HS prompt', choice);
      }
      deferredInstallPrompt = null;
    });
}


/**
 * Event handler for appinstalled event.
 *   Log the installation to analytics or save the event somehow.
 * @param {Event} evt
 */
function logAppInstalled(evt) {
  // Add code to log the event
  console.log('App was installed.', evt);
}
