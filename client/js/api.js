const API = {

    register: function (username, email, password, callback) {
        sendRequest("POST", "/register", { username, email, password }, callback);
    },

    login: function (email, password, callback) {
        sendRequest("POST", "/login", { email, password }, callback);
    },

    createRecipe: function (recipeData, callback) {
        sendRequest("POST", "/recipes/add", { ...recipeData }, callback);
    },

    updateRecipe: function (id, data, callback) {
        sendRequest("PUT", "/recipes/" + id, { ...data, requestingUserId: App.getUser().id }, callback);    
    },

    getRecipe: function (id, callback) {
        sendRequest("GET", "/recipes/" + id, null, callback);
    },

    getUsersRecipes: function(userId, callback){
        sendRequest("GET", "/recipes?userId=" + userId, null, callback);
    },

    deleteRecipe: function (id, callback) {
        sendRequest("DELETE", "/recipes/" + id, { requestingUserId: App.getUser().id }, callback);
    }

};


function sendRequest(method, url, data, callback) {
    console.log("API.sendRequest", { method, url, data });

    const xhr = new FXMLHttpRequest();

    xhr.open(method, url);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === DONE) {

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

