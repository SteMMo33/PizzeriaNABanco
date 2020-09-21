
let swRegistration


function displayNotification(reg) {

	swRegistration = reg
	
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
	  body: 'Testing Our Notification',
	  icon: './bell.png'
	};
	swRegistration.showNotification('PWA Notification!', options);
}
 