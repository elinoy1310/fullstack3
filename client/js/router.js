/*
📄 router.js

Role: SPA navigation logic.
Communicates with: view files

Responsibilities:

Render correct template

Switch between:

Login

Register

Recipes

No page reload

Important function:

navigate(route)
*/
const Router = (function () {

    const routes = {
        home:{
             templateId: null,
            viewInit: null
        },
        login: {
            templateId: "login-template",
            viewInit: () => LoginView.init()
        },
        register: {
            templateId: "register-template",
            viewInit: () => RegisterView.init()
        },
        recipes: {
            templateId: "recipes-template",
            viewInit: () => RecipesView.init()
        }
    };

    function navigate(route) {
        window.location.hash = route;
        // render(route);
    }

    function render(route) {
        const routeConfig = routes[route || "home"];
        if (!routeConfig ) return;
        
        const entry = document.getElementById("entry-point");
        if (entry) entry.classList.add("hidden");
        
        const app = document.getElementById("app");
        app.innerHTML = "";

        if (routeConfig.templateId) {
            const template = document.getElementById(routeConfig.templateId);
            const clone = template.content.cloneNode(true);
            app.appendChild(clone);
        } else {
            if (entry) {
                entry.classList.remove("hidden");
            }
        }

        if (routeConfig.viewInit) {
            routeConfig.viewInit();
        }
    }

    return {
        navigate,
        render
    };

})();