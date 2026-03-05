const AddRecipeView = {
    init() {
        const overlay = document.getElementById("addRecipeOverlay");
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
        IngredientsManager.init();
        renderCategoryList("categoriesContainer", { styleClass: "pill", checkboxClass: "pill-checkbox", interactive: true });
        document.getElementById("addIngredientBtn").onclick = () => IngredientsManager.addIngredientRow();
        document.getElementById("closeModalBtn").onclick = AddRecipeView.closeModal;
        document.getElementById("cancelRecipeBtn").onclick = AddRecipeView.closeModal;
        const form = document.getElementById("addRecipeForm");

        form.onsubmit = function (e) {
            e.preventDefault();
            AddRecipeView.saveRecipe();
        };
        document.getElementById("addRecipeBtn").classList.add("hidden");
        document.querySelector("#addRecipeForm button[type='submit']").innerText = "save";
        document.querySelector("#addRecipeForm #form-header").innerText = "Add New Recipe";
    },

    hasUnsavedChanges() {
        return document.getElementById("recipeTitle").value ||
            document.getElementById("recipeInstructions").value ||
            (document.querySelectorAll("#ingredientsList input").length === 1 &&
             document.querySelector("#ingredientsList input").value);
    },

    closeModal() {
        if (AddRecipeView.hasUnsavedChanges()) {
            if (!confirm("Discard changes?")) return;
        }
        document.getElementById("addRecipeOverlay").classList.add("hidden");
        document.getElementById("addRecipeBtn").classList.remove("hidden");
        document.body.style.overflow = "auto";
        AddRecipeView.resetForm();
        RecipesView.refreshMainView(false);
    },

    saveRecipe() {
        const title = document.getElementById("recipeTitle").value.trim();
        const instructions = document.getElementById("recipeInstructions").value.trim();
        const user = App.getUser();
        const message = document.getElementById("modalMessage");

        if (!title || !instructions) {
            message.innerText = "Please fill required fields.";
            return;
        }

        const ingredients = IngredientsManager.collectIngredients();

        if (ingredients.length === 0) {
            message.className = "error";
            message.innerText = "At least one ingredient is required.";
            return;
        }

        const categories = [...document.querySelectorAll("#categoriesContainer input:checked")]
            .map(c => c.value);

        const recipeData = {
            ownerId: user.id,
            title,
            ingredients,
            instructions,
            categories,
            prepTime: document.getElementById("recipePrepTime").value,
            difficulty: document.getElementById("recipeDifficulty").value,
            image: document.getElementById("recipeImage").value,
            createdAt: new Date()
        };

        message.className = "";
        message.innerText = "Loading...";

        API.createRecipe(recipeData, function (response) {
            if (response.status === 200) {
                message.className = "success";
                message.innerText = "Recipe added successfully! you can add another recipe or close this view.";
                AddRecipeView.resetForm(false);
                RecipesView.userRecipes.push(response.body.data);
            }
            else if (response.status === 0) {
                message.classList.add("error");
                message.innerText = "Network error, try again.";
            }
            else {
                message.classList.add("error");
                message.innerText = response.body.message;
            }
        });
    },

    resetForm(clearMessage = true) {
        const form = document.getElementById("addRecipeForm");
        form.reset();
        IngredientsManager.init();
        if (clearMessage) {
            document.getElementById("modalMessage").innerText = "";
        }
    }

}
