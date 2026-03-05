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

    const defaultUsers = [
        {
            id: 1,
            username: "Master Chef",
            email: "admin@recipe.com",
            password: "123"
        },
        {
            id: 2,
            username: "Baking Queen",
            email: "baker@recipe.com",
            password: "123"
        },
        {
            id: 3,
            username: "Vegan Ninja",
            email: "vegan@recipe.com",
            password: "123"
        }
    ];

    function getAll() {
        let users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        let addedNew = false;

        defaultUsers.forEach(defaultUser => {
            const exists = users.find(u => u.email === defaultUser.email);
            if (!exists) {
                users.push(defaultUser);
                addedNew = true;
            }
        });

        if (addedNew) {
            save(users);
        }

        return users;
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