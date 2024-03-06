const { Mrp, Barang } = require("../models/relation");

const getAllMrp = async (req, res) => {
    try {
        const pageSize = 5;
        const page = parseInt(req.query.page) || 1;
        const mrp = await Mrp.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize
        });
        res.render('Mrp/listMrp', { data: mrp, currentPage: page, totalPages: pageSize });
    } catch (error) {
        console.log(error);
        res.status(501).json("Internal server error" + error.message);
    }
}

const createMrp = async (req, res) => {
    try {
        const { mrp } = req.body;
        if (!mrp) {
            return res.status(400).json("Mrp harus di isi");
        }
        await Mrp.create({ mrp });
        res.redirect('/mrp');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const editMrp = async (req, res) => {
    try {
        const { id_mrp } = req.params;
        const existingMrp = await Mrp.findOne({ where: { id_mrp } });
        res.render('Mrp/editMrp', { data: existingMrp });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const updateMrp = async (req, res) => {
    try {
        const { id_mrp } = req.params;
        const { mrp } = req.body;
        if (!mrp) {
            return res.json('Jangan kosongkan Mrp');
        }
        const existingMrp = await Mrp.findByPk(id_mrp);
        await existingMrp.update({ mrp });
        res.redirect('/mrp');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

const deleteMrp = async (req, res) => {
    try {
        const { id_mrp } = req.params;
        const existingMrp = await Mrp.findByPk(id_mrp);

        const existingRelation = await Barang.findOne({ where: { id_mrp } });
        if (!existingRelation) {
            await existingMrp.destroy();
            return res.redirect('/mrp');
        }

        res.json("Tidak bisa dihapus karena ada relasi");
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
}

module.exports = { getAllMrp, createMrp, editMrp, updateMrp, deleteMrp };
