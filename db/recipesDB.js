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

    const defaultRecipes = [
        {
            id: 1,
            ownerId: 1,
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
            ownerId: 2,
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
            image: "https://d3o5sihylz93ps.cloudfront.net/wp-content/uploads/2020/10/27174522/%D7%A1%D7%A4%D7%92%D7%98%D7%99-%D7%A2%D7%9D-%D7%A8%D7%95%D7%98%D7%91-%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%95%D7%AA1.jpg",
            createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
            id: 3,
            ownerId: 2, 
            title: "Classic Morning Shakshuka",
            ingredients: [
                { name: "Ripe tomatoes", amount: "5 large" },
                { name: "Eggs", amount: "4" },
                { name: "Garlic", amount: "3 cloves" },
                { name: "Sweet paprika", amount: "1 tbsp" },
                { name: "Olive oil", amount: "3 tbsp" }
            ],
            instructions: "1. Chop the garlic and fry lightly in a large pan with olive oil.\n2. Dice the tomatoes and add to the pan. Cook for about 15 minutes until soft.\n3. Season with paprika, salt, and pepper.\n4. Make small wells in the sauce, crack the eggs into them, and cook for another 5-7 minutes until the egg whites are set.",
            categories: ["Breakfast", "Vegetarian", "One-Pot", "Healthy"],
            prepTime: "25",
            difficulty: "Easy",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyMIWVcgxFYXHErPvlwOZGALpXHPJuNRN8gA&s",
            createdAt: new Date(Date.now() - 5000000).toISOString()
        },
        {
            id: 4,
            ownerId: 3, 
            title: "Fresh Italian Caprese Salad",
            ingredients: [
                { name: "Tomatoes", amount: "3 large" },
                { name: "Fresh Mozzarella cheese", amount: "1 large ball" },
                { name: "Basil leaves", amount: "A handful" },
                { name: "Balsamic glaze", amount: "2 tbsp" },
                { name: "Olive oil", amount: "2 tbsp" }
            ],
            instructions: "1. Slice the tomatoes and mozzarella ball into thin, even slices.\n2. Arrange them alternately on a beautiful serving plate.\n3. Scatter the fresh basil leaves on top.\n4. Season with coarse salt and black pepper, then drizzle generously with olive oil and balsamic glaze.",
            categories: ["Lunch", "Healthy", "Vegetarian", "No-Bake", "Low-Carb"],
            prepTime: "10",
            difficulty: "Easy",
            image: "https://i.ytimg.com/vi/oy4kj2c0LhI/maxresdefault.jpg",
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            ownerId: 3, 
            title: "Classic Chocolate Chip Cookies",
            ingredients: [
                { name: "Softened butter", amount: "100g" },
                { name: "Brown sugar", amount: "1/2 cup" },
                { name: "Egg", amount: "1" },
                { name: "Flour", amount: "1.5 cups" },
                { name: "Chocolate chips", amount: "1 cup" }
            ],
            instructions: "1. Preheat oven to 180°C (350°F).\n2. Cream the butter and sugar together in a bowl.\n3. Add the egg and mix well.\n4. Gently fold in the flour and chocolate chips.\n5. Form small balls, place on a baking sheet, and bake for 10-12 minutes.",
            categories: ["Dessert", "Snack", "Baked", "Vegetarian"],
            prepTime: "20",
            difficulty: "Easy",
            image: "https://www.kipa.co.il/userFiles/2026/03/735-415/1_541bdee27e5f3492d049d2997d37d9ac.jpg",
            createdAt: new Date(Date.now() - 15000000).toISOString()
        },
        {
            id: 6,
            ownerId: 1, 
            title: "Oven-Baked Lemon Herb Salmon",
            ingredients: [
                { name: "Salmon fillets", amount: "4 pieces" },
                { name: "Olive oil", amount: "2 tbsp" },
                { name: "Fresh lemon juice", amount: "2 tbsp" },
                { name: "Minced garlic", amount: "2 cloves" },
                { name: "Salt and pepper", amount: "To taste" }
            ],
            instructions: "1. Preheat oven to 200°C (400°F).\n2. Arrange the salmon fillets on a lined baking sheet.\n3. In a small bowl, mix olive oil, lemon juice, garlic, salt, and pepper.\n4. Brush the mixture generously over the fish.\n5. Bake for 12-15 minutes until the fish flakes easily with a fork.",
            categories: ["Dinner", "Healthy", "Baked", "Gluten-Free", "Low-Carb"],
            prepTime: "20",
            difficulty: "Medium",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWjmrczDcbP3LW0ucHqn7a85x7rCEdlj16YQ&s",
            createdAt: new Date().toISOString()
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