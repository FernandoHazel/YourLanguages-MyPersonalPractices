const { Sequelize } = require(".");

const alias = "Teachers"
const col = {
    id: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    }
}
const config = {}

const Teachers = Sequelize.define(alias, col, config);
module.exports = Teachers