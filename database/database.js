const { Sequelize } = require ("sequelize");

const sequelize = new Sequelize(
    'DB_yourlanguages',
    'root', null, {
        host: 'localhost',
        dialect: "mysql"
})

module.exports = sequelize