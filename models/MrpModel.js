const { Sequelize, DataTypes } = require('sequelize');
const { db } = require('./db');

const sequelize = new Sequelize(db);

const Mrp = sequelize.define("Mrp", {
    id_mrp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    mrp: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'mrp',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
 
module.exports = {Mrp};
