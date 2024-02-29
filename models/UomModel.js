const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Uom = sequelize.define("Uom", {
    id_uom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    uom: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'uom',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Uom};
