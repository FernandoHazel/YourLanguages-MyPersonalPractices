class User {
    constructor(id, name, lastName, email, gender, userType, hashedPassword) {
        this.id = id
        this.name = name
        this.lastName = lastName
        this.email = email
        this.gender = gender
        this.userType = userType
        this.hashedPassword = hashedPassword
    }
}

module.exports = User