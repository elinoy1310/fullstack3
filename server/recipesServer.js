/*
📄 recipesServer.js

Role: Recipes business logic server.
Communicates with: recipesDB.js

Responsibilities:

Verify authenticated user

Handle REST methods:

Method	Action
GET /recipes	All recipes
GET /recipes/:id	Single recipe
POST /recipes	Add recipe
PUT /recipes/:id	Update
DELETE /recipes/:id	Delete

Return structured JSON responses

Validate:

Required fields

Ownership (userId match)
*/
/* server/recipesServer.js */
const RecipesServer = (function () {

    function handleRequest(request) {
        console.log("RecipesServer received request:", request);
        const { method, url, body } = request;

        if (method === "GET" && url === "/#recipes") {
            const recipes = RecipesDB.getAll();
            return success(recipes);
        }

        if (method === "POST" && url === "/#recipes") {
            const data = JSON.parse(body);
            const newRecipe = RecipesDB.create(data);
            return success(newRecipe);
        }

        return error("Endpoint not found in RecipesServer");
    }

    function success(data) {
        return {
            status: 200,
            body: JSON.stringify({ status: "success", data })
        };
    }

    function error(message) {
        return {
            status: 400,
            body: JSON.stringify({ status: "error", message })
        };
    }

    return {
        handleRequest
    };

})();