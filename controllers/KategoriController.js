const { Kategori, Barang } = require("../models/relation");

const getAllKategori = async (req, res) => {
    try {
        const pageSize = 5;
        const page = parseInt(req.query.page) || 1;
        const kategori = await Kategori.findAll({
            limit: pageSize,
            offset: (page - 1) * pageSize,
        });
        res.render('Kategori/listKategori', { data: kategori, currentPage: page, totalPages: pageSize });
    } catch (error) {
        console.log(error);
        res.status(501).json("Internal server error" + error.message);
    }
};

const createKategori = async (req, res) => {
    try {
        const { kategori } = req.body;
        if (!kategori) {
            return res.status(400).json("Kategori harus di isi");
        }
        await Kategori.create({ kategori });
        res.redirect('/kategori');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
};

const editKategori = async (req, res) => {
    try {
        const { id_kategori } = req.params;
        const existingKategori = await Kategori.findOne({ where: { id_kategori } });
        res.render('Kategori/editKategori', { data: existingKategori });
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
};

const updateKategori = async (req, res) => {
    try {
        const { id_kategori } = req.params;
        const { kategori } = req.body;
        if (!kategori) {
            return res.json('Jangan kosongkan kategori');
        }
        const existingKategori = await Kategori.findByPk(id_kategori);
        await existingKategori.update({ kategori });
        res.redirect('/kategori');
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
};

const deleteKategori = async (req, res) => {
    try {
        const { id_kategori } = req.params;
        const exisitingKategori = await Kategori.findByPk(id_kategori);

        const exisitingRelation = await Barang.findOne({ where: { id_kategori } });
        if (!exisitingRelation) {
            await exisitingKategori.destroy();
            return res.redirect('/kategori');
        }

        res.json("Tidak bisa dihapus karena ada relasi");
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error, ' + error.message);
    }
};


module.exports = { getAllKategori, createKategori, editKategori, updateKategori, deleteKategori };
