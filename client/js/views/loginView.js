/* js/views/loginView.js */
const LoginView = (function () {

    function init() {
        const loginBtn = document.getElementById("loginBtn");
        const goRegisterBtn = document.getElementById("goRegister");
        const messageEl = document.getElementById("login-message");

        if (loginBtn) {
            loginBtn.addEventListener("click", function (e) {
                e.preventDefault(); 

                const emailEl = document.getElementById("login-email");
                const passwordEl = document.getElementById("login-password");
                
                if (!emailEl || !passwordEl) {
                    console.error("error finding email or password input elements");
                    return;
                }

                const email = emailEl.value;
                const password = passwordEl.value;

                messageEl.textContent = "connecting...";
                messageEl.className = "";

                API.login(email, password, function (response) {
                    if (response && response.status === 200) {
                        messageEl.textContent = " logged in successfully!";
                        messageEl.className = "success";
                        
                        const userData = response.body.data;
                        App.setUser(userData);
                        
                        //continue to recipes after a short delay to show the success message
                        setTimeout(() => {
                            Router.navigate("recipes");
                        }, 500);
                        
                    } else {
                        const errorMsg = response && response.body && response.body.message 
                                         ? response.body.message 
                                         : "connect error. Please try again.";
                        messageEl.textContent = errorMsg;
                        messageEl.className = "error";
                    }
                });
            });
        }

        if (goRegisterBtn) {
            goRegisterBtn.addEventListener("click", function (e) {
                e.preventDefault();
                Router.navigate("register");
            });
        }
    }

    return { init };
})();