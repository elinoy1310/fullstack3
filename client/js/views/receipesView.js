const RecipesView = {

    // init() {
    //     const user = App.getUser();
    //     const replaceEl = document.getElementById("replace-later");
    //     if (user) {
    //         replaceEl.innerHTML = `
    //             <h2>Welcome, ${user.username}!</h2>
    //             <p>Email: ${user.email}</p>
    //             <p>User ID: ${user.id}</p>
    //             <p>User receipes list ids: ${user.receipesList}</p>
    //             <p>User favorites receipes list ids: ${user.favoritesReceipesList}</p>
    //         `;
    //     } else {
    //         replaceEl.innerHTML = `<p>User data not found. Please log in.</p>`;
    //     }
    // }
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
                //need implementation
                //Router.navigate("recipes/new");
            };

        // 📦 כרגע אין מתכונים – בעתיד נטעין
    }

}