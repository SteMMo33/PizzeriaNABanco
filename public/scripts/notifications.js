
let swRegistration

function storeRegistr(reg) {
	swRegistration = reg
}


function displayNotification(reg) {

	// swRegistration = reg
	
	//Ask user if we show notifications
   if (window.Notification && Notification.permission === 'granted') {
      notification();
   }
   // If the user hasn't told whether he wants to be notified or not
   // Note: because of Chrome, we cannot be sure the permission property
   // is set, therefore it's unsafe to check for the "default" value.
   else if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission(status => {
      	if (status === 'granted') {
         	notification();
      	} else {
         	alert('You denied or dismissed permissions to notifications.');
        }
      });
   } else {
      // If the user refuses to get notified
      alert(
        'You denied permissions to notifications. Please go to your browser or phone setting to allow notifications.'
      );
   }
}



function notification() {
	const options = {
	  	body: 'Nuova Aurora',
		icon: './images/icons/logo256.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		 },
		 actions: [
			{action: 'explore', title: 'Explore this new world',  icon: 'images/logo300.jpg'},
			{action: 'close', title: 'Close notification',  icon: 'images/icons/logo192.png'},
		 ]

	};
	swRegistration.showNotification('Ho ricevuto un ordine!', options);
}



function subscribeUser() {
	console.log("subscribeUser")
	if ('serviceWorker' in navigator) {
	  	navigator.serviceWorker.ready.then(function(reg) {
 
		 	reg.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: "BOUw3AvpYSotAI7YHDPQRieAUsGWD7ZQhCfDnCIOqHiZTdGjusvziBcr1imWDhI1Ez2UE9Lf4AwPo9lxOjoLpZM"
		 	}).then(function(sub) {
				console.log('> Subscription: ', JSON.stringify(sub));
				console.log('> Endpoint URL: ', sub.endpoint);
			}).catch(function(e) {
				if (Notification.permission === 'denied') {
			  		console.warn('Permission for notifications was denied');
				} else {
			  		console.error('Unable to subscribe to push', e);
				}
		 	});
	  	})
	}
}
 
 