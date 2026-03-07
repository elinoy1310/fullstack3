/*
Elinoy Damari 325984318
Michal Zanzuri 214848590 
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

            let response = null;
            if (request.url === "/login" || request.url === "/register") {
                response = AuthServer.handleRequest(request);
            } else {
                response = RecipesServer.handleRequest(request);
            }
            callback(response);

        }, delay);
    }

    return {
        send
    };

})();