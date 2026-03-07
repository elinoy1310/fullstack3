localStorage.clear();
const defaultRecipes = [
    {
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
        ownerId: 1,
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
        ownerId: 1,
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
    },
    {
        ownerId: 1,
        title: "Green Detox Smoothie",
        ingredients: [
            { name: "Spinach", amount: "1 cup" },
            { name: "Green apple", amount: "1/2" },
            { name: "Banana", amount: "1" },
            { name: "Almond milk", amount: "1 cup" },
            { name: "Chia seeds", amount: "1 tbsp" }
        ],
        instructions: "1. Core and slice the apple.\n2. Add all ingredients into a blender.\n3. Blend on high until perfectly smooth.\n4. Serve immediately over ice.",
        categories: ["Breakfast", "Healthy", "Vegan", "No-Bake"],
        prepTime: "5",
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
        createdAt: new Date().toISOString()
    },
    {
        ownerId: 2,
        title: "Fudgy Chocolate Brownies",
        ingredients: [
            { name: "Dark chocolate", amount: "200g" },
            { name: "Butter", amount: "150g" },
            { name: "Sugar", amount: "1 cup" },
            { name: "Eggs", amount: "3" },
            { name: "Flour", amount: "1/2 cup" },
            { name: "Cocoa powder", amount: "1/4 cup" }
        ],
        instructions: "1. Preheat oven to 180°C.\n2. Melt butter and chocolate together in a microwave or double boiler.\n3. Whisk sugar and eggs into the chocolate mixture.\n4. Fold in flour and cocoa powder until just combined.\n5. Pour into a lined baking pan and bake for 25-30 minutes.",
        categories: ["Dessert", "Baked", "Vegetarian"],
        prepTime: "40",
        difficulty: "Medium",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
        createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
        ownerId: 2,
        title: "Homemade Blueberry Muffins",
        ingredients: [
            { name: "Flour", amount: "2 cups" },
            { name: "Sugar", amount: "3/4 cup" },
            { name: "Baking powder", amount: "2 tsp" },
            { name: "Milk", amount: "1/2 cup" },
            { name: "Oil", amount: "1/2 cup" },
            { name: "Egg", amount: "1" },
            { name: "Fresh blueberries", amount: "1.5 cups" }
        ],
        instructions: "1. Preheat oven to 200°C and line a muffin tin.\n2. Mix dry ingredients in one bowl, and wet ingredients in another.\n3. Combine wet and dry ingredients gently (do not overmix).\n4. Fold in the blueberries.\n5. Divide batter into muffin cups and bake for 15-20 minutes until golden.",
        categories: ["Breakfast", "Dessert", "Baked", "Vegetarian"],
        prepTime: "30",
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7bc655c?w=600&q=80",
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        ownerId: 3,
        title: "Creamy Vegan Sweet Potato Soup",
        ingredients: [
            { name: "Sweet potatoes", amount: "3 large" },
            { name: "Onion", amount: "1" },
            { name: "Vegetable broth", amount: "4 cups" },
            { name: "Coconut milk", amount: "1 can" },
            { name: "Olive oil", amount: "2 tbsp" }
        ],
        instructions: "1. Chop the onion and cube the sweet potatoes.\n2. Sauté the onion in olive oil until soft.\n3. Add sweet potatoes and broth, bring to a boil, then simmer for 20 minutes.\n4. Blend until smooth.\n5. Stir in coconut milk and season to taste.",
        categories: ["Dinner", "Lunch", "Vegan", "Healthy", "One-Pot"],
        prepTime: "35",
        difficulty: "Easy",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
        createdAt: new Date(Date.now() - 5000000).toISOString()
    }

];

const defaultUsers = [
    {
        email: "admin@gmail.com",
        username: "Dani",
        password: "1234"
    },
    {
        email: "baker@gmail.com",
        username: "Baking Queen",
        password: "1234"
    },
    {
        email: "vegan@gmail.com",
        username: "the best chef",
        password: "1234"
    }
];

defaultRecipes.forEach(recipe => { RecipesDB.create(recipe) })
defaultUsers.forEach(user => { UsersDB.create(user) })