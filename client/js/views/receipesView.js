const RECIPE_CATEGORIES = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Low-Carb",
    "Dairy-Free",
    "Healthy",
    "One-Pot",
    "Baked",
    "Grilled",
    "No-Bake"
];

const RecipesView = {
    userRecipes: [],
    filteredRecipes: [],

    init() {

        const user = App.getUser();

        if (!user) {
            Router.navigate("login");
            return;
        }

        document.getElementById("welcomeMessage")
            .innerText = `Hi ${user.username}`;

        // 🔴 Logout
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.classList.remove("hidden");
        logoutBtn.onclick = function () {
            App.setUser(null);
            logoutBtn.classList.add("hidden");
            Router.navigate("");
        };


        // ➕ Add Recipe

        document.getElementById("addRecipeBtn")
            .onclick = function () {
                addRecipeView.init();
            };

        // ➖ DELETE Recipe  * temporary place to activate the function - need to change after recipe full view is completed

        // load user recipes
        this.loadUserRecipes(user.id);

        // Search functionality
        document.getElementById("searchInput")
            .addEventListener("input", (e) => {
                this.searchRecipes(e.target.value);
            });

        // filter functionality
        document.getElementById("openFilterBtn")
            .onclick = () => {
                document.getElementById("filterPanel")
                    .classList.toggle("hidden");
            };

        document.getElementById("closeFilterBtn")
            .onclick = () => {
                document.getElementById("filterPanel")
                    .classList.add("hidden");
            };

        document.getElementById("applyFilterBtn")
            .onclick = () => this.applyFilter();
        this.renderFilterCategories();

        // sort functionality
        document.getElementById("openSortBtn")
            .onclick = () => {
                document.getElementById("sortPanel")
                    .classList.toggle("hidden");
            };

        document.getElementById("applySortBtn")
            .onclick = () => this.applySort();
        document.getElementById("closeSortBtn")
            .onclick = () => {
                document.getElementById("sortPanel")
                    .classList.add("hidden");
            };
        document.getElementById("resetBtn")
            .onclick = () => this.refreshMainView(false);

    },

    deleteRecipe(recipeId) {
        if (!recipeId) {
            alert("Please enter recipe ID");
            return;
        }
        //after implementation of recipe full view we dont need to get the recipe again because we will have the data in the view, but for now we need to get the recipe to show the name in the confirm message
        API.getRecipe(recipeId, function (response) {
            const message = document.getElementById("deleteMessage");
            if (response.status == 200) {
                const recipe = response.body.data;

                const confirmDelete = confirm(
                    `Are you sure you want to delete "${recipe.title}"?`
                );

                if (!confirmDelete) return;
                const messageEl = document.getElementById("deleteMessage");
                messageEl.className = "";
                messageEl.innerText = "Deleting...";
                API.deleteRecipe(recipeId, function (response) {

                    if (response.status === 200) {
                        messageEl.className = "success";
                        messageEl.innerText = `Recipe: ${recipe.title} deleted successfully!`;
                        RecipesView.userRecipes = RecipesView.userRecipes.filter(r => r.id !== recipeId);
                        // change to do this after closing the full view because of the delete 
                        RecipesView.refreshMainView();
                    }
                    else if (response.status === 0) {
                        messageEl.className = "error";
                        messageEl.innerText = "Network error";
                    }
                    else {
                        messageEl.className = "error";
                        messageEl.innerText = response.body.message;
                    }
                });
            }
            else if (response.status === 0) {
                message.className = "error";
                message.innerText = "Network error";
            }
            else {
                message.className = "error";
                message.innerText = response.body.message;
            }

        });
    },
    loadUserRecipes(userId) {
        API.getUsersRecipes(userId, (response) => {
            if (response.status === 200) {
                this.userRecipes = response.body.data;
                this.filteredRecipes = [...this.userRecipes];
                this.refreshMainView();
            } else {
                // need to change to write in message in recipes full view: divide to network error : status==0 and else
                alert("Failed to load recipes");
                console.log("Failed to load recipes", response);
            }
        });
    },
    refreshMainView(filtered = true) {
        // console.clear();
        if (filtered) {
            console.log("Displayed recipes:", this.filteredRecipes);

            if (this.filteredRecipes.length === 0) {
                console.log("No recipes found.");
            }
        }
        else {
            console.log("Displayed recipes:", this.userRecipes);

            if (this.userRecipes.length === 0) {
                console.log("No recipes found.");
            }
        }
    },

    searchRecipes(query) {
        if (!query.trim()) {
            this.filteredRecipes = [...this.userRecipes];
        } else {
            this.filteredRecipes = this.userRecipes.filter(recipe =>
                recipe.title.toLowerCase().includes(query.toLowerCase())
            );
        }

        this.refreshMainView();
    },
    renderFilterCategories() {

        const container = document.getElementById("filterCategories");
        container.innerHTML = "";

        RECIPE_CATEGORIES.forEach(cat => {

            const label = document.createElement("label");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.value = cat;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(cat));

            container.appendChild(label);
            container.appendChild(document.createElement("br"));
        });
    },
    applyFilter() {

        const selectedCategories = [...document.querySelectorAll("#filterCategories input:checked")]
            .map(cb => cb.value);

        const minTime = parseInt(document.getElementById("filterMinTime").value);
        const maxTime = parseInt(document.getElementById("filterMaxTime").value);

        if (minTime && maxTime && minTime > maxTime) {
            alert("From time must be smaller than To time");
            return;
        }

        this.filteredRecipes = this.userRecipes.filter(recipe => {

            const matchCategory =
                selectedCategories.length === 0 ||
                selectedCategories.some(cat => recipe.categories.includes(cat));

            const prep = parseInt(recipe.prepTime) || 0;

            const matchTime =
                (!minTime || prep >= minTime) &&
                (!maxTime || prep <= maxTime) || !prep;

            return matchCategory && matchTime;
        });

        this.refreshMainView();
    },
    applySort() {

        const field = document.querySelector('input[name="sortField"]:checked').value;
        const order = document.querySelector('input[name="sortOrder"]:checked').value;

        this.filteredRecipes.sort((a, b) => {

            let valueA = a[field];
            let valueB = b[field];

            // 🟢 עדיפות למי שיש prepTime
            if (field === "prepTime") {

                const hasA = valueA !== undefined && valueA !== null && valueA !== "";
                const hasB = valueB !== undefined && valueB !== null && valueB !== "";

                if (hasA && !hasB) return -1;
                if (!hasA && hasB) return 1;

                valueA = parseInt(valueA) || 0;
                valueB = parseInt(valueB) || 0;
            }

            if (field === "title") {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            if (field === "createdAt") {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            }

            if (valueA < valueB) return order === "asc" ? -1 : 1;
            if (valueA > valueB) return order === "asc" ? 1 : -1;
            return 0;
        });

        this.refreshMainView();
    }
};

const addRecipeView = {
    init() {
        const overlay = document.getElementById("addRecipeOverlay");
        overlay.classList.remove("hidden");
        addRecipeView.initIngredients();
        addRecipeView.renderCategories();
        document.getElementById("addIngredientBtn").onclick = () => addRecipeView.addIngredientRow();
        document.getElementById("closeModalBtn").onclick = addRecipeView.closeModal;
        document.getElementById("cancelRecipeBtn").onclick = addRecipeView.closeModal;
        const form = document.getElementById("addRecipeForm");

        form.onsubmit = function (e) {
            e.preventDefault();
            addRecipeView.saveRecipe();
        };
        document.getElementById("addRecipeBtn").classList.add("hidden");
        document.querySelector("#addRecipeForm button[type='submit']").innerText = "save";
        document.querySelector("#addRecipeForm #form-header").innerText = "Add New Recipe";
    },
    renderCategories() {

        const container = document.getElementById("categoriesContainer");
        container.innerHTML = ""; // נקי לפני יצירה

        RECIPE_CATEGORIES.forEach(cat => {
            const label = document.createElement("label");
            label.className = "pill";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = cat;
            checkbox.className = "pill-checkbox";

            // הוספת טקסט לצד הכפתור
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(cat));

            container.appendChild(label);

            // הוספת אינטראקטיביות – לחיצה על הלייבל משנה את המצב
            label.onclick = () => {
                checkbox.checked = !checkbox.checked;
                label.classList.toggle("selected", checkbox.checked);
            };
        });
    },

    hasUnsavedChanges() {

        return document.getElementById("recipeTitle").value ||
            document.getElementById("recipeInstructions").value ||
            (document.querySelectorAll("#ingredientsList input").length === 1 && document.querySelector("#ingredientsList input").value);
    },

    closeModal() {
        if (addRecipeView.hasUnsavedChanges()) {
            if (!confirm("Discard changes?")) return;
        }
        document.getElementById("addRecipeOverlay").classList.add("hidden");
        document.getElementById("addRecipeBtn").classList.remove("hidden");
        addRecipeView.resetForm();
        RecipesView.refreshMainView(false);
    },

    initIngredients() {
        const list = document.getElementById("ingredientsList");
        list.innerHTML = "";
        addRecipeView.addIngredientRow();
    },

    addIngredientRow(name = "", amount = "") {
        const list = document.getElementById("ingredientsList");

        const row = document.createElement("div");
        row.className = "ingredient-row";

        row.innerHTML = `
        <input type="text" placeholder="Ingredient" value="${name}">
        <input type="text" placeholder="Amount" value="${amount}">
        <button type="button" class="removeBtn">✖</button>
    `;
        const removeBtn = row.querySelector(".removeBtn");
        const inputs = row.querySelectorAll("input");

        inputs.forEach(input => {
            input.addEventListener("input", () => {
                addRecipeView.updateAddButtonState();
            });
        });

        removeBtn.onclick = function () {
            if (list.children.length > 1) {
                row.remove();
                addRecipeView.updateRemoveButtons();
                addRecipeView.updateAddButtonState();
            }
        };

        list.appendChild(row);
        addRecipeView.updateRemoveButtons();
        addRecipeView.updateAddButtonState();
    },

    updateRemoveButtons() {
        const list = document.getElementById("ingredientsList");
        const buttons = list.querySelectorAll(".removeBtn");

        buttons.forEach(btn => {
            btn.disabled = (list.children.length === 1);
        });
    },
    updateAddButtonState() {
        const list = document.getElementById("ingredientsList");
        const addBtn = document.getElementById("addIngredientBtn");

        const rows = list.querySelectorAll(".ingredient-row");

        const allFilled = Array.from(rows).every(row => {
            const inputs = row.querySelectorAll("input");
            return inputs[0].value.trim() !== "" &&
                inputs[1].value.trim() !== "";
        });

        addBtn.disabled = !allFilled;
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

        const ingredients = [];
        document.querySelectorAll("#ingredientsList .ingredient-row")
            .forEach(row => {
                const inputs = row.querySelectorAll("input");
                if (inputs[0].value.trim()) {
                    ingredients.push({
                        name: inputs[0].value.trim(),
                        amount: inputs[1].value.trim()
                    });
                }
            });

        if (ingredients.length === 0) {
            message.className = "error";
            message.innerText = "At least one ingredient required.";
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
                message.innerText = "Recipe added successfully!";
                addRecipeView.resetForm(false);
                RecipesView.userRecipes.push(response.body.data);

            }
            else if (response.status === 0) {
                message.classList.add("error");
                message.innerText = "Network error. Try again.";
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
        addRecipeView.initIngredients();
        if (clearMessage) {
            document.getElementById("modalMessage").innerText = "";
        }
    }

}

const editRecipeView = {

    originalData: null,
    currentRecipeId: null,

    init(recipeId) {

        API.getRecipe(recipeId, (response) => {
            if (response.status === 200) {
                const recipe = response.body.data;
                this.currentRecipeId = recipeId;
                this.originalData = JSON.stringify(recipe);

                this.currentRecipeId = recipeId;
                this.originalData = JSON.stringify(recipe);

                const overlay = document.getElementById("addRecipeOverlay");
                overlay.classList.remove("hidden");

                document.getElementById("addRecipeBtn").classList.add("hidden");
                // add for temp edit button - change this when recipe full view is implemented
                document.getElementById("editRecipeIdInput").classList.add("hidden");

                this.fillForm(recipe);
                this.bindEvents();

                document.querySelector("#addRecipeForm button[type='submit']").innerText = "update";
                document.querySelector("#addRecipeForm #form-header").innerText = "Edit Recipe";
            } else {
                //need to change to write in message in recipes full view: divide to network error : status==0 and else
                alert("Failed to load recipe");
                return;
            }
        });
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
            addRecipeView.addIngredientRow(i.name, i.amount);
        });

        // Categories
        addRecipeView.renderCategories();

        document.querySelectorAll("#categoriesContainer input").forEach(cb => {
            if (recipe.categories.includes(cb.value)) {
                cb.checked = true;
                cb.parentElement.classList.add("selected");
            }
        });
    },

    bindEvents() {
        document.getElementById("addIngredientBtn").onclick = () => addRecipeView.addIngredientRow();

        const form = document.getElementById("addRecipeForm");

        form.onsubmit = (e) => {
            e.preventDefault();
            this.updateRecipe();
        };

        document.getElementById("closeModalBtn").onclick = () => this.closeModal();
        document.getElementById("cancelRecipeBtn").onclick = () => this.closeModal();
    },

    collectFormData() {
        const ingredients = [];
        document.querySelectorAll("#ingredientsList .ingredient-row")
            .forEach(row => {
                const inputs = row.querySelectorAll("input");
                if (inputs[0].value.trim()) {
                    ingredients.push({
                        name: inputs[0].value.trim(),
                        amount: inputs[1].value.trim()
                    });
                }
            });

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
        const original = JSON.parse(this.originalData);
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
            message.innerText = "At least one ingredient required.";
            return;
        }
        message.className = "";
        message.innerText = "Loading...";

        API.updateRecipe(this.currentRecipeId, data, (response) => {

            if (response.status === 200) {
                message.className = "success";
                message.innerText = "Recipe updated successfully!";
                this.originalData = JSON.stringify(response.body.data);

                const index = RecipesView.userRecipes.findIndex(r => r.id === this.currentRecipeId);
                RecipesView.userRecipes[index] = response.body.data;


            }
            else if (response.status === 0) {
                message.className = "error";
                message.innerText = "Network error.";
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

        this.reset();
        RecipesView.refreshMainView();
    },

    reset() {

        document.getElementById("addRecipeOverlay").classList.add("hidden");
        document.getElementById("addRecipeBtn").classList.remove("hidden");
        document.getElementById("editRecipeIdInput").classList.remove("hidden");
        //add for temp edit button

        document.getElementById("addRecipeForm").reset();
        document.getElementById("modalMessage").innerText = "";

        this.originalData = null;
        this.currentRecipeId = null;
    }
};

