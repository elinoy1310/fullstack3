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

        // Logout
        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn.classList.remove("hidden");
        logoutBtn.onclick = function () {
            App.setUser(null);
            logoutBtn.classList.add("hidden");
            Router.navigate("");
        };

        // Add Recipe
        document.getElementById("addRecipeBtn")
            .onclick = function () {
                AddRecipeView.init();
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

        renderCategoryList("filterCategories", { addBr: true });

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
        messageBox.innerHTML = '<div class="loader"></div>';

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

    refreshMainView(useFiltered = true) {

        const container = document.getElementById("recipesContainer");
        const messageBox = document.getElementById("recipesMessage");

        container.innerHTML = "";
        messageBox.innerHTML = "";

        const recipes = useFiltered ? this.filteredRecipes : this.userRecipes;

        if (!recipes || recipes.length === 0) {
            messageBox.innerHTML = `
            <div class="message-box">
                No recipes found.
            </div>
        `;
            return;
        }

        recipes.forEach(recipe => {
            const card = this.renderRecipeCard(recipe);
            container.appendChild(card);
        });
    },

    renderRecipeCard(recipe) {
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
        
        const heartIcon = recipe.isFavorite ? "❤️" : "🤍";
        
        card.innerHTML = `
            <button class="favorite-btn" title="Add to favorites">${heartIcon}</button>
            <div class="recipe-card-title">
                ${recipe.title}
            </div>
        `;

        const favBtn = card.querySelector(".favorite-btn");
        favBtn.onclick = (e) => {
            e.stopPropagation();
            
            //update UI immediately for better UX
            recipe.isFavorite = !recipe.isFavorite;
            favBtn.innerHTML = recipe.isFavorite ? "❤️" : "🤍";
            
            // send to server
            const user = App.getUser();
            const updateData = { ...recipe, requestingUserId: user.id };
            
            API.updateRecipe(recipe.id, updateData, (response) => {
                if (response.status !== 200) {
                    recipe.isFavorite = !recipe.isFavorite;
                    favBtn.innerHTML = recipe.isFavorite ? "❤️" : "🤍";
                    alert("Network error, couldn't save favorite status.");
                }
            });
        };

        card.onclick = () => {
            RecipeFullView.open(recipe);
        };
        return card;
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

        this.filteredRecipes = [...this.userRecipes].sort((a, b) => {

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

function renderCategoryList(containerId, options = {}) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const { styleClass = "", checkboxClass = "", interactive = false, addBr = false } = options;

    RECIPE_CATEGORIES.forEach(cat => {
        const label = document.createElement("label");
        if (styleClass) label.className = styleClass;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = cat;
        if (checkboxClass) checkbox.className = checkboxClass;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(cat));

        container.appendChild(label);
        if (addBr) container.appendChild(document.createElement("br"));

        if (interactive) {
            label.onclick = () => {
                checkbox.checked = !checkbox.checked;
                label.classList.toggle("selected", checkbox.checked);
            };
        }
    });
}

const IngredientsManager = {
    containerId: "ingredientsList",
    addBtnId: "addIngredientBtn",

    init() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = "";
        this.addIngredientRow();
        this.updateAddButtonState();
    },

    addIngredientRow(name = "", amount = "") {
        const container = document.getElementById(this.containerId);

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
            input.addEventListener("input", () => this.updateAddButtonState());
        });

        removeBtn.onclick = () => {
            if (container.children.length > 1) {
                row.remove();
                this.updateRemoveButtons();
                this.updateAddButtonState();
            }
        };

        container.appendChild(row);
        this.updateRemoveButtons();
        this.updateAddButtonState();
    },

    updateRemoveButtons() {
        const container = document.getElementById(this.containerId);
        const buttons = container.querySelectorAll(".removeBtn");
        buttons.forEach(btn => {
            btn.disabled = (container.children.length === 1);
        });
    },

    updateAddButtonState() {
        const container = document.getElementById(this.containerId);
        const addBtn = document.getElementById(this.addBtnId);

        const rows = container.querySelectorAll(".ingredient-row");
        const allFilled = Array.from(rows).every(row => {
            const inputs = row.querySelectorAll("input");
            return inputs[0].value.trim() !== "" && inputs[1].value.trim() !== "";
        });

        addBtn.disabled = !allFilled;
    },

    collectIngredients() {
        const container = document.getElementById(this.containerId);
        const ingredients = [];
        container.querySelectorAll(".ingredient-row").forEach(row => {
            const inputs = row.querySelectorAll("input");
            if (inputs[0].value.trim()) {
                ingredients.push({ 
                    name: inputs[0].value.trim(), 
                    amount: inputs[1].value.trim() 
                });
            }
        });
        return ingredients;
    },

};
