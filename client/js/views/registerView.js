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

            API.register(username, email, password, function (response) {
                if (response.status === 200) {
                    messageEl.className = "success";
                    messageEl.innerText = "Registration successful! Redirecting to login...";
                    
                    document.getElementById("login-navigator").classList.add("hidden");
                    document.getElementById("success-login-navigator").classList.remove("hidden");
                    
                    document.getElementById("registerBtn").classList.add("hidden");

                    setTimeout(() => {
                        Router.navigate("login");
                    }, 1500);

                } 
                else if (response.status === 0) {
                    messageEl.className = "error";
                    messageEl.innerText = "Network error. Try again.";
                } 
                else {
                    messageEl.className = "error";
                    // חייבים לפענח את ה-JSON שחוזר מהשרת לפני שקוראים את ה-message
                    try {
                        
                        const bodyData = response.body;
                        messageEl.innerText = bodyData.message || "Registration failed.";
                    } catch (err) {
                       
                        messageEl.innerText = "Registration failed.";
                    }
                }
            });
        };

        document.getElementById("goLogin").onclick = () => { Router.navigate("login"); };
        document.getElementById("goLoginBtn").onclick = () => { Router.navigate("login"); };
    }
};