const { body, validationResult } = require('express-validator');
const Unit = require("../models/UnitModel");

const createUnit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
        
        const unit = await Unit.create({ unit: req.body.unit });
        res.status(201).json(unit);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const getAllUnit = async (req, res) => {
    try {
        const units = await Unit.findAll();
        res.status(200).json(units);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const updateUnit = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const unitId = req.params.id;
        const updatedUnit = await Unit.update({ unit: req.body.unit }, { where: { id_unit: unitId } });
        res.status(200).json(updatedUnit);
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const deleteUnit = async (req, res) => {
    try {
        const unitId = req.params.id;
        await Unit.destroy({ where: { id_unit: unitId } });
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const validationRules = {
    create: [body('unit').notEmpty().withMessage('Unit name is required')],
    update: [body('unit').notEmpty().withMessage('Unit name is required')],
};

module.exports = { createUnit, getAllUnit, updateUnit, deleteUnit, validationRules };
