/*
📄 recipesDB.js

Role: Recipes storage manager (LocalStorage).
Communicates with: recipesServer.js

Stores under key: "recipes"

Important functions:

getAll()

getById(id)

create(recipe)

update(id, data)

delete(id)
*/
/* db/receipesDB.js */
const RecipesDB = (function () {
    const STORAGE_KEY = "recipes"; 

    function getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function save(recipes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    }

    function create(recipe) {
        const recipes = getAll();
        recipe.id = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1; 
        recipes.push(recipe);
        save(recipes);
        return recipe;
    }

    function deleteRecipe(id) {
        let recipes = getAll();
        recipes = recipes.filter(r => r.id !== id);
        save(recipes);
    }

    return {
        getAll,
        create,
        deleteRecipe
    };
})();