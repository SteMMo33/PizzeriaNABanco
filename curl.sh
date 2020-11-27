
#curl "https://android.googleapis.com/gcm/send/AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd" \
#--request POST --header "TTL: 60" --header "Content-Length: 0" \
#--header "Authorization: key=AIzaSyD1JcZ8WM1vTtH6Y0tXq_Pnuw4jgj_92yg"

# Versione v1
# Ha bisogno di una autorizzazione
curl -X POST -H "Authorization: Bearer AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd" -H "Content-Type: application/json" -d '{
"message":{
   "notification":{
     "title":"FCM Message",
     "body":"This is an FCM Message"
   },
   "token":"fh_24D06e6VpP-il_9zby1:APA91bGQkEA3mDA3PCLMdsmdy_qixqYPcbq9J1mXDnbiyAWwZQOi1XPJNaXwIrT1JekqMLYxm8c7OJnt6jYt3s9fHBPBHYqQQ0o49RIeFXp_QoqIxmIvrTxNA-QOLCZ6pXwSFdhmYzUc"
}}' https://fcm.googleapis.com/v1/projects/pizzeria-nuova-aurora/messages:send



#
curl -X POST -H "Authorization: key=AAAAgzYZK-I:APA91bGyrlD3xJ1jNjNYcYGavCPskow9n7CSw0YtlrbEp84DrUD_XZ96U8dPB0ajD6D3XK352MXsh6Tk1rr0_yx9i3oX_pIz-_vuPleWHll0zjlTQfu-GW1YA4xQ7LhTlZedbv2NPMZd" \
   -H "Content-Type: application/json" \
   -d '{
    "data": {
        "notification": {
            "title": "FCM Message v1",
            "body": "This is an FCM Message from curl",
            "icon": "/itwonders-web-logo.png",
        }
    },
    "to": "fh_24D06e6VpP-il_9zby1:APA91bGQkEA3mDA3PCLMdsmdy_qixqYPcbq9J1mXDnbiyAWwZQOi1XPJNaXwIrT1JekqMLYxm8c7OJnt6jYt3s9fHBPBHYqQQ0o49RIeFXp_QoqIxmIvrTxNA-QOLCZ6pXwSFdhmYzUc"
    }' https://fcm.googleapis.com/fcm/send