/* js/views/recipesView.js */
const RecipesView = (function () {

    function init() {
        const logoutBtn = document.getElementById("logout-btn");
        const addRecipeBtn = document.getElementById("add-recipe-btn");

        // exit/logout
        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                App.setUser(null);
                Router.navigate("login");
            });
        }

        // add new recipe
        if (addRecipeBtn) {
            addRecipeBtn.addEventListener("click", function () {
                const title = prompt("איך קוראים למתכון החדש שלך?");
                if (!title) return; // user canceled or entered empty title

                const description = prompt("תארי את המתכון בכמה מילים:");
                if (!description) return;

                // add object (FAJAX)
                const newRecipe = { title: title, description: description };
                
                API.createRecipe(newRecipe, function(response) {
                    if (response && response.status === 200) {
                        // the adding was successful, we can refresh the list to show the new recipe
                        loadRecipes();
                    } else {
                        alert("there was an error adding the recipe. Please try again.");
                    }
                });
            });
        }

        loadRecipes();
    }

    function loadRecipes() {
        const container = document.getElementById("recipes-list");
        if (!container) return;

        container.innerHTML = "<p class='col-span-full text-center text-slate-500 font-bold'>loading recipes ...</p>";

        API.getAllRecipes(function(response) {
            container.innerHTML = ""; // clear loading message

            if (response && response.status === 200) {
                const recipes = response.body.data || [];
                
                // if the screen is empty
                if (recipes.length === 0) {
                    container.innerHTML = "<p class='col-span-full text-center text-slate-500'>עדיין אין כאן מתכונים. לחצי על 'הוסף מתכון' כדי להתחיל!</p>";
                    return;
                }

                recipes.forEach(recipe => {
                    const template = document.getElementById("recipe-card-template");
                    const clone = template.content.cloneNode(true);
                    
                    // enter the recipe data into the card
                    clone.querySelector(".recipe-title").textContent = recipe.title;
                    clone.querySelector(".recipe-description").textContent = recipe.description;
                    
                    clone.querySelector(".delete-btn").addEventListener("click", () => {
                        alert(" delete recipe: " + recipe.title + " in the future");
                    });
                    
                    container.appendChild(clone);
                });
            } else {
                container.innerHTML = "<p class='error'>error loading recipes</p>";
            }
        });
    }

    return { init };
})();