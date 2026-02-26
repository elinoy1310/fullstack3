const LoginView = {

    init() {

        document.getElementById("loginForm").onsubmit = function (e) {
            e.preventDefault();
            console.log("Login form submitted");
            

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const messageEl = document.getElementById("login-message");

            console.log("Login form data:", { email, password });

            messageEl.className = "";
            messageEl.innerText = "Loading...";

            API.login(email, password, function (response) {
                console.log("Login API response:", response);

                if (response.status === 200) {
                    App.setUser(response.body.data); //check what data contains maybe we need only the id : change if needded after the charactarization of the main page of the receipes
                    messageEl.classList.add("success");
                    messageEl.innerText = "Login success!";
                    setTimeout(() => {
                        Router.navigate("recipes");
                    }, 1000);
                } 
                else if (response.status === 0) {
                    messageEl.classList.add("error");
                    messageEl.innerText = "Network error. Try again.";
                } 
                else {
                    messageEl.classList.add("error");
                    messageEl.innerText = response.body.message;
                }

        });

    };

    document.getElementById("goRegister").onclick = function () {Router.navigate("register");};
}

};