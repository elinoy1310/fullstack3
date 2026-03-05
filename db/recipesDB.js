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
        return recipe;
    }

    function getByRecipeId(recipeId) {
        return getAll().find(r => r.id === recipeId);
    }
    function getAllByUserId(userId) {
        return getAll().filter(r => r.ownerId === userId);
    }

    function update(id, data) {
        const recipes = getAll();
        const index = recipes.findIndex(r => r.id === id);

        if (index === -1) return null;

        recipes[index] = {
            ...recipes[index],
            ...data,
            id
        };

        save(recipes);
        return recipes[index];
    }

    function deleteRecipe(id) {

        const recipes = getAll();
        const filtered = recipes.filter(r => r.id !== id);

        if (filtered.length === recipes.length) {
            return false;
        }

        save(filtered);
        return true;
    }

    return {
        getAll,
        getByRecipeId,
        getAllByUserId,
        create,
        update,
        deleteRecipe
    };

})();