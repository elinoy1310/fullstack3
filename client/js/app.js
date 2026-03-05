// app.js
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

    // שמירת המשתמש ב-sessionStorage ובזיכרון מקומי בזמן הריצה
    function setUser(user) {
        currentUser = user; // משתנה זמני בזמן הריצה
        sessionStorage.setItem('currentUser', JSON.stringify(user)); // שמירה ב-sessionStorage
    }

    // קבלת המשתמש: קודם מנסה מהזיכרון, אם אין – מנסה sessionStorage
    function getUser() {
        if (currentUser) return currentUser;

        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            return currentUser;
        }

        return null; // אם אין משתמש בכלל
    }

    return {
        init,
        setUser,
        getUser
    };

})();

document.addEventListener("DOMContentLoaded", function () { App.init(); });