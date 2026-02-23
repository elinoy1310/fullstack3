const App = (function () {

    let currentUser = null;
    
    function init() {
        const route = window.location.hash.replace("#", "");

        if (route) {
            Router.render(route);
        }
        
        window.onhashchange = function () {

            const newRoute = window.location.hash.replace("#", "");
            console.log( window.location.hash);


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

    function setUser(user) {
        currentUser = user;
    }

    function getUser() {
        return currentUser;
    }

    return {
        init,
        setUser,
        getUser
    };

})();

document.addEventListener("DOMContentLoaded", function () {App.init();});