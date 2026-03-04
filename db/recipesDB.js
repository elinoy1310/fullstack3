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
            ownerId: 1, // שייך למשתמש הראשון שיירשם במערכת
            title: "פנקייק אוורירי מושלם",
            ingredients: [
                { name: "קמח לבן", amount: "1 כוס" },
                { name: "חלב", amount: "1 כוס" },
                { name: "ביצה", amount: "1" },
                { name: "סוכר", amount: "2 כפות" }
            ],
            instructions: "1. מערבבים את הקמח והסוכר בקערה.\n2. מוסיפים את החלב והביצה וטורפים היטב עד שאין גושים.\n3. מחממים מחבת עם מעט חמאה.\n4. יוצקים מהבלילה ומטגנים כדקה מכל צד עד להזהבה.",
            categories: ["Breakfast", "Vegetarian", "Dessert"],
            prepTime: "15",
            difficulty: "Easy",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR59dFPp8XqS9Xbmic7XUXA8oH0_pWVrORMzQ&s",
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            ownerId: 1, // שייך למשתמש הראשון שיירשם במערכת
            title: "פסטה ברוטב עגבניות טריות ושום",
            ingredients: [
                { name: "פסטה", amount: "500 גרם" },
                { name: "עגבניות שרי", amount: "200 גרם" },
                { name: "שום", amount: "3 שיניים" },
                { name: "שמן זית", amount: "3 כפות" },
                { name: "בזיליקום", amount: "חופן" }
            ],
            instructions: "1. מבשלים את הפסטה בסיר עם מים מומלחים לפי ההוראות.\n2. במחבת גדולה, מטגנים את השום הפרוס בשמן זית על אש קטנה.\n3. מוסיפים את עגבניות השרי החצויות ומבשלים כ-10 דקות.\n4. מסננים את הפסטה, מעבירים למחבת, מוסיפים בזיליקום ומערבבים היטב.",
            categories: ["Dinner", "Lunch", "Vegan"],
            prepTime: "30",
            difficulty: "Medium",
            image: "https://udiosher.com/wp-content/uploads/2021/04/%D7%A4%D7%A1%D7%98%D7%94-%D7%91%D7%A8%D7%95%D7%98%D7%91-%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%95%D7%AA-%D7%95%D7%A2%D7%93%D7%A9%D7%99%D7%9D.jpeg",
            createdAt: new Date(Date.now() - 86400000).toISOString() // נוצר אתמול
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