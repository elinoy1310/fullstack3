const App = (function () {

    let currentUser = null;

    function init() {
        const route = window.location.hash.replace("#", "");

        if (route) {
            Router.render(route);
        }

        window.onhashchange = function () {

            const newRoute = window.location.hash.replace("#", "");
            Router.render(newRoute);
        };


        const loginBtn = document.getElementById("login-btn");
        loginBtn.addEventListener("click", function () {
            Router.navigate("login");
        });
        const registerBtn = document.getElementById("register-btn");
        registerBtn.addEventListener("click", function () {
            Router.navigate("register");
        });
    }

    //save user in memory and sessionStorage for persistence across reloads
    function setUser(user) {
        currentUser = user; 
        sessionStorage.setItem('currentUser', JSON.stringify(user)); // save in sessionStorage
    }

    // get user from memory or sessionStorage
    function getUser() {
        if (currentUser) return currentUser;

        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            return currentUser;
        }

        return null; // if no user
    }

    return {
        init,
        setUser,
        getUser
    };

})();

document.addEventListener("DOMContentLoaded", function () { App.init(); });