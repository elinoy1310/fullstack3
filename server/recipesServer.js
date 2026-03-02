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


const RecipesServer = (function () {

    function handleRequest(request) {

        const { method, url, body } = request;

        if (method === "POST" && url === "/recipes/add") {
            return create(JSON.parse(body));
        }
        if (method === "PUT" && url.startsWith("/recipes/")) {
            const id = parseInt(url.split("/")[2]);
            return updateRecipe(id, JSON.parse(body));
        }
        if (method === "GET" && url.startsWith("/recipes/")) {
            const id = parseInt(url.split("/")[2]);
            return getRecipe(id)
        };

        return {
            status: 404,
            body: JSON.stringify({ message: "Not found" })
        };
    }

    function getRecipe(id) {
        const recipe = RecipesDB.getByRecipeId(id);
        if (!recipe) {
            return error("Recipe not found")
        }
        return success(recipe);
    }
    
    function create(data) {
        if (!data.title || !data.instructions) {
            return error("Missing fields");
        }
        RecipesDB.create(data)
        return success()
    }

    function updateRecipe(id, data) {

        if (!data.title || !data.instructions) {
            return error("Missing fields");
        }

        const recipe = RecipesDB.getByRecipeId(id);
        if (!recipe) {
            return error("Recipe not found")
        }

        const updated = RecipesDB.update(id, data);

        return success(updated);
    }

    function success(data = null) {
        return {
            status: 200,
            body: JSON.stringify({
                status: "success",
                data
            })
        };
    }

    function error(message) {
        return {
            status: 400,
            body: JSON.stringify({
                status: "error",
                message
            })
        };
    }


    return {
        handleRequest
    };

})();
