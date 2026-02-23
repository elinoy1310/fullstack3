const RegisterView = {

    init() {
    document.getElementById("registerForm").onsubmit = function (e) {
        e.preventDefault();

        const username = document.getElementById("register-username").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-confirmPassword").value;
        const messageEl = document.getElementById("register-message");

        if (password !== confirmPassword) {
            messageEl.className = "error";
            messageEl.innerText = "Passwords do not match!";
            return;
        }
        messageEl.className = "";
        messageEl.innerText = "Loading...";

        API.register(username,email,password, function (response) {

            if (response.status === 200) {
                messageEl.classList.add("success");
                messageEl.innerText = "Registration successful!";
                document.getElementById("login-navigator").classList.add("hidden");
                document.getElementById("success-login-navigator").classList.remove("hidden");

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

    document.getElementById("goLogin").onclick = () => {  Router.navigate("login"); };
    document.getElementById("goLoginBtn").onclick = () => { Router.navigate("login"); };

}

};