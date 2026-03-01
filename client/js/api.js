/*
Role: Client-side REST wrapper.
Communicates with: fajax.js

Responsibilities:
Provide simple methods for:

Auth:

login(username, password)

register(username, password)

Recipes:

getAllRecipes()

getRecipe(id)

createRecipe(data)

updateRecipe(id, data)

deleteRecipe(id)

This keeps views clean.
*/

// const API = {

//     register(username,email,password, callback){
//         return sendRequest("POST", "/#register", { username, password });
//     },

//     login(username, password) {
//         return sendRequest("POST", "/#login", { username, password });
//     }

// };


const API = {

    register: function(username, email, password, callback) {
        sendRequest("POST", "/register", { username, email, password ,server:Network.AUTH_SERVER_NAME}, callback);
    },

    login: function(email, password, callback) {
        sendRequest("POST", "/login", { email, password, server:Network.AUTH_SERVER_NAME }, callback);
    },

    createRecipe: function(recipeData, callback) {
        sendRequest("POST", "/recipes/add", { ...recipeData, server:Network.RECIPES_SERVER_NAME }, callback);
    }

};


function sendRequest(method, url, data, callback) {
    console.log("API.sendRequest", { method, url, data });

    const xhr = new FXMLHttpRequest();

    xhr.open(method, url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {

            let body = {};
            try {
                body = JSON.parse(xhr.responseText);
            } catch (e) {
                body = {};
            }

            callback({
                status: xhr.status,
                body: body
            });
        }
    };

    xhr.onerror = function () {
        callback({ status: 0 }); // Network error
    };

    xhr.send(JSON.stringify(data));
}

