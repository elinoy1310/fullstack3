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
    const AUTH_SERVER_NAME="auth";
    const RECIPES_SERVER_NAME="recipes";

    function send(request, callback) {

        const delay = Math.floor(Math.random() * 2000) + 1000;

        const shouldDrop = Math.random() < DROP_RATE; 

        setTimeout(() => {
            console.log("Network.deliver", { request, delay, shouldDrop });

            if (shouldDrop) {
                callback(null); // dropped
                return;
            }
            console.log("Network.deliver: delivering request to server", request.body.server);
// how to route to correct server: authServer or recipesServer? 
            let response = null;
            if (request.url === "/login" || request.url === "/register") {
                console.log("Routing to AuthServer");
             response = AuthServer.handleRequest(request);
            } else {
                 response = RecipesServer.handleRequest(request);
                 console.log("Routing to RecipesServer");
            }

            callback(response);

        }, delay);
    }

    return {
        AUTH_SERVER_NAME,
        RECIPES_SERVER_NAME,
        send
    };

})();