const { v4: uuid } = require('uuid');
const { users } = require('../storage/inMemoryDb');

class User {
    constructor({ email, passwordHash }) {
        this.id = uuid();
        this.email = email;
        this.passwordHash = passwordHash;
        this.profile = { photos: [] };
    }

    static create({ email, passwordHash }) {
        const user = new User({ email, passwordHash });
        users.set(user.id, user);
        return user;
    }

    static findByEmail(email) {
        return [...users.values()].find(u => u.email === email);
    }

    static findById(id) {
        return users.get(id);
    }

    updateProfile(data) {
        Object.entries(data).forEach(([key, value]) => {
            this.profile[key] = value;
        });
    }
}

module.exports = User;
