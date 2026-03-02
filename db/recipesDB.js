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


const RecipesDB = (function () {

    const STORAGE_KEY = "recipes";
    function getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function save(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function create(recipe) {
        const recipes = getAll();
        recipe.id = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;
        recipes.push(recipe);
        save(recipes);
    }

    function getByRecipeId(recipeId) {
        return getAll().find(r => r.id === recipeId);
    }

    function update(id, data) {
        const recipes = getAll();
        const index = recipes.findIndex(r => r.id === id);

        if (index === -1) return null;

        recipes[index] = {
            ...recipes[index],
            ...data,
            id // לוודא שלא משתנה
        };

        save(recipes);
        return recipes[index];
    }

    return {
        getAll,
        getByRecipeId,
        create,
        update
    };

})();