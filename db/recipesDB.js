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

    // ---- המתכונים הקבועים שלנו ----
    const defaultRecipes = [
        {
            id: 1,
            ownerId: 1, // Belongs to the first registered user
            title: "Perfect Fluffy Pancakes",
            ingredients: [
                { name: "White flour", amount: "1 cup" },
                { name: "Milk", amount: "1 cup" },
                { name: "Egg", amount: "1" },
                { name: "Sugar", amount: "2 tablespoons" }
            ],
            instructions: "1. Mix the flour and sugar in a bowl.\n2. Add the milk and egg and whisk well until there are no lumps.\n3. Heat a pan with a little butter.\n4. Pour some batter and fry for about a minute on each side until golden.",
            categories: ["Breakfast", "Vegetarian", "Dessert"],
            prepTime: "15",
            difficulty: "Easy",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR59dFPp8XqS9Xbmic7XUXA8oH0_pWVrORMzQ&s",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            ownerId: 1, // Belongs to the first registered user
            title: "Pasta with Fresh Tomatoes and Garlic",
            ingredients: [
                { name: "Pasta", amount: "500 grams" },
                { name: "Cherry tomatoes", amount: "200 grams" },
                { name: "Garlic", amount: "3 cloves" },
                { name: "Olive oil", amount: "3 tablespoons" },
                { name: "Basil", amount: "A handful" }
            ],
            instructions: "1. Cook the pasta in a pot with salted water according to the package instructions.\n2. In a large pan, fry the sliced garlic in olive oil over low heat.\n3. Add the halved cherry tomatoes and cook for about 10 minutes.\n4. Drain the pasta, transfer to the pan, add basil, and mix well.",
            categories: ["Dinner", "Lunch", "Vegan"],
            prepTime: "30",
            difficulty: "Medium",
            image: "https://udiosher.com/wp-content/uploads/2021/04/%D7%A4%D7%A1%D7%98%D7%94-%D7%91%D7%A8%D7%95%D7%91-%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%95%D7%AA-%D7%95%D7%A2%D7%93%D7%A9%D7%99%D7%9D.jpeg",
            createdAt: new Date(Date.now() - 86400000).toISOString() // Created yesterday
        }
    ];

    function getAll() {
        let recipes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let addedNew = false;

        defaultRecipes.forEach(defaultRecipe => {
            const exists = recipes.find(r => r.title === defaultRecipe.title);
            
            if (!exists) {
                const currentMaxId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) : 0;
                const recipeToAdd = { ...defaultRecipe, id: currentMaxId + 1 };
                recipes.push(recipeToAdd);
                addedNew = true;
            }
        });

        // שומרים רק אם הוספנו משהו חדש
        if (addedNew) {
            save(recipes);
        }

        return recipes;
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
            id // לוודא שלא משתנה
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