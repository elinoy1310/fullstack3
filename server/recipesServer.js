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