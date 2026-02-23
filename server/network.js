/*
network.js

Role: Simulated network layer.
Communicates with: fajax.js, authServer.js, recipesServer.js

Responsibilities:

Route request to correct server

Add random delay (1–3 sec)

Randomly drop request (e.g. 20%)

Important functions:

send(message)

deliver(message)

simulateDelay()

shouldDrop()
*/
const DROP_RATE = 0.2; // range: 0.1 - 0.5
const Network = (function () {

    function send(request, callback) {

        const delay = Math.floor(Math.random() * 2000) + 1000;

        const shouldDrop = Math.random() < DROP_RATE; 

        setTimeout(() => {

            if (shouldDrop) {
                callback(null); // dropped
                return;
            }
// how to route to correct server: authServer or recipesServer? 
            const response = AuthServer.handleRequest(request);

            callback(response);

        }, delay);
    }

    return {
        send
    };

})();