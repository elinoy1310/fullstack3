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

        return {
            status: 404,
            body: JSON.stringify({ message: "Not found" })
        };
    }
    function create(data) {
        console.log("RecipesServer.create", data);
        if (!data.title || !data.instructions) {
            return error("Missing fields");
        }
    RecipesDB.create(data)
    return success()
    }

    function success() {
        return {
            status: 200,
            body: JSON.stringify({
                status: "success"
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
