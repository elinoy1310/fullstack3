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
                console.log("Add recipe clicked - to be implemented");
                addRecipeView.init();


            };


        // 📦 כרגע אין מתכונים – בעתיד נטעין
    }





}



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
    },
    renderCategories() {
    // const container = document.getElementById("categoriesContainer");
    // container.innerHTML = "";

    // RECIPE_CATEGORIES.forEach(category => {
    //     const label = document.createElement("label");

    //     label.innerHTML = `
    //         <input type="checkbox" value="${category}">
    //         ${category}
    //     `;

    //     container.appendChild(label);
    // });

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
        addRecipeView.resetForm();
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
            modalMessage.innerText = "";
        }
    }

}