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

const AUTH_SERVER_NAME="auth";
const RECIPES_SERVER_NAME="recipes";

const API = {

    register: function(username, email, password, callback) {
        // הפנייה ל-sendRequest עם callback
        sendRequest("POST", "/#register", { username, email, password ,server:AUTH_SERVER_NAME}, callback);
    },

    login: function(username, password, callback) {
        sendRequest("POST", "/#login", { username, password, server:AUTH_SERVER_NAME }, callback);
    },
    
    getAllRecipes: function(callback) {
        sendRequest("GET", "/#recipes", null, callback);
    },

    createRecipe: function(recipeData, callback) {
        sendRequest("POST", "/#recipes", recipeData, callback);
    }

};

function sendRequest(method, url, data, callback) {

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

