const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Unit = sequelize.define("Unit", {
    id_unit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_plant:{
        type: DataTypes.INTEGER,
    }
}, {
    tableName: 'unit',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Unit};
