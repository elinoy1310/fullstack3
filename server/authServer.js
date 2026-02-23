/*
📄 authServer.js

Role: Authentication server.
Communicates with: usersDB.js

Responsibilities:

Handle:

POST /login

POST /register

Validate credentials

Return JSON response
 */

const AuthServer = (function () {

    function handleRequest(request) {
        console.log("AuthServer received request:", request);

        const { method, url, body } = request;

        if (method === "POST" && url === "/#register") {
            return register(JSON.parse(body));
        }

        if (method === "POST" && url === "/#login") {
            return login(JSON.parse(body));
        }

        return {
            status: 404,
            body: JSON.stringify({ message: "Not found" })
        };
    }

    function register(data) {
//data: { username, email, password }
// need to check: UsersDB.getByUsername(data.email)
//             UsersDB.create({
        //     email: data.email,
        //     username: data.username,
        //     password: data.password
        // });     
        if (!data.username ||!data.email || !data.password) {
            return error("Missing fields");
        }

        if (UsersDB.getByUsername(data.email)) {
            return error("User with email: " + data.email + " already exists");
        }

        const newUser = UsersDB.create({
            email: data.email,
            username: data.username,
            password: data.password
        });

        return success(newUser);
    }

    function login(data) {

        const user = UsersDB.getByUsername(data.username);

        if (!user || user.password !== data.password) {
            return error("Invalid credentials");
        }

        return success(user);
    }

    function success(data) {
        return {
            status: 200,
            body: JSON.stringify({
                status: "success",
                data
            })
        };
    }

    function error(message) {
        return {
            status: 400,
            body: JSON.stringify({
                status: "error",
                message
            })
        };
    }

    return {
        handleRequest
    };

})();