const {DataTypes} = require('sequelize')
const sequelize = require('../database')
const User = require('./User')

const UserType = sequelize.define('UserTypes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING
    }
},{
    //Here you can add aditional config like
    //timestamps: false
})

// One user type has many users
UserType.hasMany(User, {
    foreignKey: 'userTypeId',
    sourceKey: 'id'
})

// User belongs to user type
User.belongsTo(UserType, {
    foreignKey: 'userTypeId',
    targetKey: 'id'
})

module.exports = UserType