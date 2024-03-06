const { body, validationResult } = require('express-validator');
const {Unit, Plant, DetailPemintaanCriticalPart} = require("../models/relation");

const createUnit = async (req, res) => {
  try {
        const {unit,plant} = req.body
        if(!unit ){
            res.status(400).json('all field are required')
            return;
        }
        await Unit.create({ unit,id_plant:plant });
        res.status(201).redirect('/unit');
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};
const formUnit = async (req,res)=>{
    try {
        const plant = await Plant.findAll()
        
        res.render('Unit/addUnit',{plant})
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
const getAllUnit = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 5; 

        const units = await Unit.findAll({
            limit:pageSize,
            offset:(page-1 )*pageSize,
            include:[{
                model:Plant
            }] 
        });
       
        res.status(201).render('Unit/listUnit',{
            data:units,   
            currentPage: page,
            totalPages: pageSize});
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};
const editUnit = async (req,res)=>{
    try {
        const {id_unit} = req.params

        const existingUnit = await Unit.findOne({where:{id_unit},include:[{model:Plant}]})
        const plant  = await Plant.findAll()
        res.render('Unit/editUnit',{data:existingUnit,plant})
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}
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
        const {id_unit} = req.params;
        const existingRelationUnit = await DetailPemintaanCriticalPart.findAll({where:{id_unit}}) 
        if(existingRelationUnit&&existingRelationUnit.length>0){
            res.status(400).json('unit tidak bisa dihapus')
            return;
        }
        await Unit.destroy({ where: { id_unit } });
        res.status(204).redirect('/unit');
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error, " + error.message);
    }
};

const validationRules = {
    create: [body('unit').notEmpty().withMessage('Unit name is required')],
    update: [body('unit').notEmpty().withMessage('Unit name is required')],
};

module.exports = { createUnit, getAllUnit, updateUnit, deleteUnit, formUnit,editUnit };
