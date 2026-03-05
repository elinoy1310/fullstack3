const RecipeFullView = {

    currentRecipe: null,

    open(recipe) {

        this.currentRecipe = recipe;
        const overlay = document.getElementById("recipeFullOverlay");
        const content = document.getElementById("recipeFullContent");

        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        document.getElementById("recipeFullMessage").classList.remove("error", "success");
        document.getElementById("recipeFullMessage").classList.add("hidden");


        let difficultyClass = "";
        if (recipe.difficulty === "Easy") difficultyClass = "difficulty-easy";
        if (recipe.difficulty === "Medium") difficultyClass = "difficulty-medium";
        if (recipe.difficulty === "Hard") difficultyClass = "difficulty-hard";

        content.innerHTML = `
            <div class="recipe-full-header">
                <span>${recipe.title}</span>
            </div>

            <div class="recipe-meta">
                ${recipe.prepTime ? `<div><strong>Preparation Time:</strong> ${recipe.prepTime} minutes</div>` : ""}
                
                ${recipe.categories && recipe.categories.length > 0
                ? `<div><strong>Categories:</strong> 
                        ${recipe.categories.map(c => `<span class="category-badge">${c}</span>`).join("")}
                       </div>`
                : ""}

                ${recipe.difficulty
                ? `<div><strong>Difficulty:</strong> 
                        <span class="${difficultyClass}">${recipe.difficulty}</span>
                       </div>`
                : ""}
            </div>

            <div class="recipe-section-title">Ingredients</div>
            <ul>
                ${recipe.ingredients.map(i =>
                    `<li>${i.name} : ${i.amount}</li>`
                ).join("")}
            </ul>

            <div class="recipe-section-title">Instructions</div>
            <div class="recipe-instructions">
             ${recipe.instructions}
            </div>
        `;

        const header = content.querySelector(".recipe-full-header");
        header.style.backgroundImage = "";
        if (recipe.image) {
            const img = new Image();
            img.src = recipe.image

            img.onload = () => {
                header.style.backgroundImage = `url(${recipe.image})`;

            };

            img.onerror = () => {
                header.style.backgroundImage = `url('${DEFAULT_RECIPE_IMAGE}')`;
            };
        } else {
            header.style.backgroundImage = `url('${DEFAULT_RECIPE_IMAGE}')`;
        }

        this.bindActions();

        const messageEl = document.getElementById("recipeFullMessage");
        messageEl.innerText = "";
    },

    bindActions() {

        document.getElementById("fullBackBtn").onclick = () => {
            this.close();
        };

        document.getElementById("fullEditBtn").onclick = () => {
            EditRecipeView.init(this.currentRecipe);
        };

        document.getElementById("fullDeleteBtn").onclick = () => {
            this.deleteRecipe();
        };
    },

    deleteRecipe() {
        const message = document.getElementById("recipeFullMessage");
        const recipe = this.currentRecipe

        const confirmDelete = confirm(
            `Are you sure you want to delete "${recipe.title}"?`
        );

        if (!confirmDelete) return;
        message.className = "";
        message.innerText = "Deleting...";
        API.deleteRecipe(recipe.id, function (response) {

            if (response.status === 200) {
                message.className = "success";
                message.innerText = `Recipe: ${recipe.title} deleted successfully!`;
                RecipesView.userRecipes = RecipesView.userRecipes.filter(r => r.id !== recipe.id);
                setTimeout(() => {
                RecipeFullView.close();
                RecipesView.refreshMainView(false);
                },1000);
            }
            else if (response.status === 0) {
                message.className = "error";
                message.innerText = "Network error, try again.";
            }
            else {
                message.className = "error";
                message.innerText = response.body.message;
            }
        });
    },

    close() {
        document.getElementById("recipeFullOverlay")
            .classList.add("hidden");
        document.body.style.overflow = "auto";
    }
};
