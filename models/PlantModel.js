const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Plant = sequelize.define("plant", {
    id_plant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    plant: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'plant',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Plant};
