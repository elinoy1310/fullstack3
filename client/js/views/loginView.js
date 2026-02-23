const LoginView = {

    // init() {

    //     document.getElementById("loginBtn").onclick = async () => {

    //         const username = document.getElementById("login-username").value;
    //         const password = document.getElementById("login-password").value;
    //         const messageEl = document.getElementById("login-message");

    //         messageEl.innerText = "Loading...";

    //         const response = await API.login(username, password);

    //         if (response.status === 200) {
    //             App.setUser(response.body.data);
    //             messageEl.innerText = "Login success!";
    //             // בהמשך ננווט למסך recipes
    //         } 
    //         else if (response.status === 0) {
    //             messageEl.innerText = "Network error. Try again.";
    //         }
    //         else {
    //             messageEl.innerText = response.body.message;
    //         }
    //     };

    //     document.getElementById("goRegister").onclick = () => {
    //         Router.navigate("register");
    //     };
    // }
    init() {

        document.getElementById("loginBtn").onclick = function () {

            const username = document.getElementById("login-username").value;
            const password = document.getElementById("login-password").value;
            const messageEl = document.getElementById("login-message");

            messageEl.innerText = "Loading...";

            API.login(username, password, function (response) {

                if (response.status === 200) {
                    App.setUser(response.body.data);
                    messageEl.innerText = "Login success!";
                } 
                else if (response.status === 0) {
                    messageEl.innerText = "Network error. Try again.";
                } 
                else {
                    messageEl.innerText = response.body.message;
                }

        });

    };

    document.getElementById("goRegister").onclick = function () {
        Router.navigate("register");
    };
}

};