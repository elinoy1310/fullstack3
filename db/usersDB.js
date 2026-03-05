/*
📄 usersDB.js

Role: Users storage manager (LocalStorage).
Communicates with: authServer.js

Stores under key: "users"

Important functions:

getAll()

getByUsername(username)

create(user)

save(data)
*/

const UsersDB = (function () {

    const STORAGE_KEY = "users"; 
    function getAll() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function save(users) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }

    function getByUsername(email) {
        return getAll().find(u => u.email === email);
    }

    function create(user) {
        const users = getAll();
        user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1; 
        users.push(user);
        save(users);
        return {userId: user.id};
    }

    return {
        getAll,
        getByUsername,
        create
    };

})();