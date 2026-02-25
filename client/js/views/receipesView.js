const RecipesView = {

    init() {
        const user = App.getUser();
        const replaceEl = document.getElementById("replace-later");
        if (user) {
            replaceEl.innerHTML = `
                <h2>Welcome, ${user.username}!</h2>
                <p>Email: ${user.email}</p>
                <p>User ID: ${user.id}</p>
                <p>User receipes list ids: ${user.receipesList}</p>
                <p>User favorites receipes list ids: ${user.favoritesReceipesList}</p>
            `;
        } else {
            replaceEl.innerHTML = `<p>User data not found. Please log in.</p>`;
        }
    }
}