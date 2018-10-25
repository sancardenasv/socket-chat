class Users {
    constructor() {
        this.persons = [];
    }

    addPerson(id, name, lobby) {
        let person = { id, name, lobby };
        this.persons.push(person);

        return this.persons;
    }

    getPersonById(id) {
        let person = this.persons.filter(per => per.id === id)[0];
        return person;
    }

    getPersons() {
        return this.persons;
    }

    getPersonsByLoby(lobby) {
        let lobbyPersons = this.persons.filter(person => {
            return person.lobby === lobby
        });

        return lobbyPersons;
    }

    removePerson(id) {
        let personRemoved = this.getPersonById(id);
        this.persons = this.persons.filter(per => per.id !== id);

        return personRemoved;
    }
}

module.exports = {
    Users
}