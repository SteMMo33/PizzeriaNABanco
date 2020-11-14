var webPush = require('web-push');

var pushSubscription = /* {
    // "endpoint":"https://android.googleapis.com/gcm/send/f1LsxkKphfQ:APA91bFUx7ja4BK4JVrNgVjpg1cs9lGSGI6IMNL4mQ3Xe6mDGxvt_C_gItKYJI9CAx5i_Ss6cmDxdWZoLyhS2RJhkcv7LeE6hkiOsK6oBzbyifvKCdUYU7ADIRBiYNxIVpLIYeZ8kq_A",
    "endpoint": "https://fcm.googleapis.com/fcm/send/eVh6YCaaUsA:APA91bGB7nSYVXUZboJ7_pgXwF2U4FNiYQqf0AwCv8E_df3zDDRh1eBjK4n_VjvKvNrZd9UVOi9sY7M5V5EJca2sz395QG-o569q69h6aS_uvWVd6ibwPvD0D-3NYs0zrU3E0r0sj5Tx",
    "keys":{
        "p256dh":"BOUw3AvpYSotAI7YHDPQRieAUsGWD7ZQhCfDnCIOqHiZTdGjusvziBcr1imWDhI1Ez2UE9Lf4AwPo9lxOjoLpZM", 
        "auth":"5I2Bu2oKdyy9CwL8QVF0NQ=="
    }
    */

   {
     "endpoint":"https://fcm.googleapis.com/fcm/send/eVh6YCaaUsA:APA91bGB7nSYVXUZboJ7_pgXwF2U4FNiYQqf0AwCv8E_df3zDDRh1eBjK4n_VjvKvNrZd9UVOi9sY7M5V5EJca2sz395QG-o569q69h6aS_uvWVd6ibwPvD0D-3NYs0zrU3E0r0sj5Tx",
     "expirationTime":null,
     "keys":{
       "p256dh":"BMAyijXgNk1Dt5SeUDANRQRO_GjJ9y9l1vG7dw5Aa8drtIUdub024PS0QXWIKzg8pSdET4ms3IRqpsHJ9XSL0AA",
       "auth":"Ho0BvSzvvxlEUZp0GHHTBQ"}
    }

var payload = 'Here is a payload!';

var options = {
  gcmAPIKey: 'AIzaSyD1JcZ8WM1vTtH6Y0tXq_Pnuw4jgj_92yg',
  TTL: 60
};

// Invio notifiche dal server

try {
  webPush.sendNotification(
    pushSubscription,
    payload,
    options
  );
}
catch(ex){
  console.error(ex)
}