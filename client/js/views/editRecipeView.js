const EditRecipeView = {

    originalData: null,
    currentRecipeId: null,

    init(recipe) {

        this.currentRecipeId = recipe.id;
        this.originalData = recipe;

        const overlay = document.getElementById("addRecipeOverlay");
        overlay.classList.remove("hidden");

        document.getElementById("addRecipeBtn").classList.add("hidden");

        this.fillForm(recipe);
        this.bindEvents();

        document.querySelector("#addRecipeForm button[type='submit']").innerText = "update";
        document.querySelector("#addRecipeForm #form-header").innerText = "Edit Recipe";
        RecipeFullView.close();
    },

    fillForm(recipe) {

        document.getElementById("recipeTitle").value = recipe.title;
        document.getElementById("recipeInstructions").value = recipe.instructions;
        document.getElementById("recipePrepTime").value = recipe.prepTime || "";
        document.getElementById("recipeDifficulty").value = recipe.difficulty || "";
        document.getElementById("recipeImage").value = recipe.image || "";

        // Ingredients
        const list = document.getElementById("ingredientsList");
        list.innerHTML = "";
        recipe.ingredients.forEach(i => {
            IngredientsManager.addIngredientRow(i.name, i.amount);
        });

        // Categories
        renderCategoryList("categoriesContainer", { styleClass: "pill", checkboxClass: "pill-checkbox", interactive: true });

        document.querySelectorAll("#categoriesContainer input").forEach(cb => {
            if (recipe.categories.includes(cb.value)) {
                cb.checked = true;
                cb.parentElement.classList.add("selected");
            }
        });
    },

    bindEvents() {
        document.getElementById("addIngredientBtn").onclick = () => IngredientsManager.addIngredientRow();

        const form = document.getElementById("addRecipeForm");

        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateRecipe();
        };

        document.getElementById("closeModalBtn").onclick = () => this.closeModal();
        document.getElementById("cancelRecipeBtn").onclick = () => this.closeModal();
    },

    collectFormData() {
        const ingredients = IngredientsManager.collectIngredients();

        const categories = [...document.querySelectorAll("#categoriesContainer input:checked")]
            .map(c => c.value);

        return {
            title: document.getElementById("recipeTitle").value.trim(),
            ingredients,
            instructions: document.getElementById("recipeInstructions").value.trim(),
            categories,
            prepTime: document.getElementById("recipePrepTime").value,
            difficulty: document.getElementById("recipeDifficulty").value,
            image: document.getElementById("recipeImage").value,
        };
    },

    hasUnsavedChanges() {
        const original = structuredClone(this.originalData);
        delete original.ownerId
        delete original.createdAt
        delete original.id
        delete original.server

        const currentData = this.collectFormData();
        return JSON.stringify(currentData) !== JSON.stringify(original);
    },

    updateRecipe() {

        const message = document.getElementById("modalMessage");
        const data = this.collectFormData();

        if (!data.title || !data.instructions) {
            message.innerText = "Please fill required fields.";
            return;
        }

        if (data.ingredients.length === 0) {
            message.className = "error";
            message.innerText = "At least one ingredient is required.";
            return;
        }
        message.className = "";
        message.innerText = "Loading...";
        console.log(this.originalData)
        console.log(this.currentRecipeId)
        API.updateRecipe(this.currentRecipeId, data, (response) => {

            if (response.status === 200) {
                message.className = "success";
                message.innerText = "Recipe updated successfully!"; // קיצרנו את ההודעה כי החלון ייסגר מיד

                this.originalData = response.body.data;

                // update in userRecipes array
                const index = RecipesView.userRecipes.findIndex(r => r.id === this.currentRecipeId);
                if (index !== -1) {
                    RecipesView.userRecipes[index] = response.body.data;
                }

                // update in filteredRecipes array
                const filterIndex = RecipesView.filteredRecipes.findIndex(r => r.id === this.currentRecipeId);
                if (filterIndex !== -1) {
                    RecipesView.filteredRecipes[filterIndex] = response.body.data;
                }

                //closing the modal
                setTimeout(() => {
                    this.closeModal();
                }, 1000); 

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

    closeModal() {

        if (this.hasUnsavedChanges()) {
            if (!confirm("Discard changes?")) return;
        }

        RecipesView.refreshMainView(false);
        RecipeFullView.open(this.originalData);
        this.reset();
    },

    reset() {
        document.getElementById("addRecipeOverlay").classList.add("hidden");
        document.getElementById("addRecipeBtn").classList.remove("hidden");

        document.getElementById("addRecipeForm").reset();
        document.getElementById("modalMessage").innerText = "";
        document.getElementById("modalMessage").className = "";

        this.originalData = null;
        this.currentRecipeId = null;
    }
};