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
const DEFAULT_RECIPE_IMAGE = "styles/images/default-background-img.jpeg";

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
            .onclick = () => {
                this.refreshMainView(false);
                document.getElementById("searchInput").value = "";
            }

    },

    loadUserRecipes(userId) {

        const messageBox = document.getElementById("recipesMessage");
        const container = document.getElementById("recipesContainer");

        container.innerHTML = "";
        messageBox.innerHTML = "Loading...";

        API.getUsersRecipes(userId, (response) => {

            if (response.status === 200) {
                this.userRecipes = response.body.data;
                this.filteredRecipes = [...this.userRecipes];
                this.refreshMainView();
            }
            else if (response.status === 0) {

                messageBox.innerHTML = `
                <div class="message-box">
                    Network error, try again.
                    <br>
                    <button class="reload-btn" id="reloadBtn">Reload</button>
                </div>
            `;

                document.getElementById("reloadBtn").onclick = () => {
                    this.loadUserRecipes(userId);
                };
            }
            else {
                messageBox.innerHTML = `
                <div class="message-box">
                    ${response.body.message}
                </div>
            `;
            }
        });
    },

    refreshMainView(filtered = true) {

        const container = document.getElementById("recipesContainer");
        const messageBox = document.getElementById("recipesMessage");

        container.innerHTML = "";
        messageBox.innerHTML = "";

        const recipes = filtered ? this.filteredRecipes : this.userRecipes;

        if (!recipes || recipes.length === 0) {
            messageBox.innerHTML = `
            <div class="message-box">
                No recipes found.
            </div>
        `;
            return;
        }

        recipes.forEach(recipe => {

            const card = document.createElement("div");
            card.className = "recipe-card";

            const imageUrl = recipe.image && recipe.image.trim() !== ""
                ? recipe.image
                : DEFAULT_RECIPE_IMAGE;

            const img = new Image();

            img.onload = () => {
                card.style.backgroundImage = `url('${imageUrl}')`;
            };

            img.onerror = () => {
                card.style.backgroundImage = `url('${DEFAULT_RECIPE_IMAGE}')`;
            };

            img.src = imageUrl;
            card.innerHTML = `
            <div class="recipe-card-title">
                ${recipe.title}
            </div>
        `;

            card.onclick = () => {
                console.log("Recipe with ID:", recipe.id);
                recipeFullView.open(recipe);
            };

            container.appendChild(card);
        });
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

        document.getElementById("filterPanel").classList.add("hidden");
        this.resetFilterPanel();
    },

    applySort() {

        const field = document.querySelector('input[name="sortField"]:checked').value;
        const order = document.querySelector('input[name="sortOrder"]:checked').value;

         this.filteredRecipes=[...this.userRecipes].sort((a, b) => {

            let valueA = a[field];
            let valueB = b[field];

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

        document.getElementById("sortPanel").classList.add("hidden");
        this.resetSortPanel();
    },
    resetFilterPanel() {

    document.getElementById("filterMinTime").value = "";
    document.getElementById("filterMaxTime").value = "";

    document.querySelectorAll("#filterCategories input")
        .forEach(cb => cb.checked = false);
},

resetSortPanel() {

    document.querySelector('input[name="sortField"][value="title"]').checked = true;
    document.querySelector('input[name="sortOrder"][value="asc"]').checked = true;
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
        container.innerHTML = "";

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
                addRecipeView.resetForm(false);
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
        addRecipeView.initIngredients();
        if (clearMessage) {
            document.getElementById("modalMessage").innerText = "";
        }
    }

}

const editRecipeView = {

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
        recipeFullView.close();
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
                message.innerText = "Recipe updated successfully! you can continue editing or close this view and go back to the recipe's full view.";

                this.originalData = response.body.data;
        
                // 1. עדכון במערך המתכונים הראשי
                const index = RecipesView.userRecipes.findIndex(r => r.id === this.currentRecipeId);
                if (index !== -1) {
                    RecipesView.userRecipes[index] = response.body.data;
                }

                // 2. **התיקון:** עדכון במערך המתכונים שמוצג על המסך! (כדי שהתמונה תשתנה מיד)
                const filterIndex = RecipesView.filteredRecipes.findIndex(r => r.id === this.currentRecipeId);
                if (filterIndex !== -1) {
                    RecipesView.filteredRecipes[filterIndex] = response.body.data;
                }

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
        recipeFullView.open(this.originalData);
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

const recipeFullView = {

    currentRecipe: null,

    open(recipe) {

        this.currentRecipe = recipe;
        this.clearMessage();
        const overlay = document.getElementById("recipeFullOverlay");
        const content = document.getElementById("recipeFullContent");

        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";

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
    },

    bindActions() {

        document.getElementById("fullBackBtn").onclick = () => {
            this.close();
        };

        document.getElementById("fullEditBtn").onclick = () => {
            editRecipeView.init(this.currentRecipe);
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
                recipeFullView.close();
                RecipesView.refreshMainView();
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
    },

    clearMessage() {
        const messageEl = document.getElementById("recipeFullMessage");
        messageEl.innerText = "";
        messageEl.className = "full-message";
    }
};

