var express = require('express');
const { getAllUnit, formUnit, createUnit, deleteUnit, editUnit } = require('../controllers/UnitController');
const { getAllUsers,getUserTable, createUser, editUser, createUserForm, deleteUser, updateUser } = require('../controllers/UserController');
const {getCriticalPart, getDetailPermintaan, getPermintaanExcel, createCriticalPart, createPermintaanForm } = require('../controllers/DetailCriticalPartController');
const multer = require('multer');
const { getAllBarng, getExcelBarang, AddBarang, createBarang, editBarang, updateBarang, deleteBarang } = require('../controllers/BarangController');
const { formLogin, login, logout } = require('../controllers/AuthController');
const { authenticateToken } = require('../controllers/middleware');
const { getAllJenis, createJenis, editJenis, updateJenis, deleteJenis } = require('../controllers/JenisController');
const { updateKategori, deleteKategori, editKategori, createKategori, getAllKategori } = require('../controllers/KategoriController');
const { getAllMrp, createMrp, editMrp, updateMrp, deleteMrp } = require('../controllers/MrpController');
const { getAllUOM, createUOM, editUOM, updateUOM, deleteUOM } = require('../controllers/UomController');
const { getAllPlant, createPlant, editPlant, updatePlant, deletePlant } = require('../controllers/PlantController');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

var router = express.Router();

router.get('/login',formLogin)
router.post('/login',login)

router.use(authenticateToken)
router.get('/', (req, res, next)=> {
  res.render('index', { title: 'Home' ,layout:'layout',page:"home"});
});

router.get('/unit',getAllUnit)
router.get('/addUnit',formUnit)
router.post('/addUnit',createUnit)
router.get('/unit/:id_unit',editUnit)
router.post('/unit/:id_unit/delete',deleteUnit)

router.get('/criticalPart',getCriticalPart)
router.get('/permintaan',getDetailPermintaan)
router.post('/addPermintaanForm',createPermintaanForm)

router.get('/user',getAllUsers)
router.get('/addUser',(req,res)=>{res.render('./User/addUser',{ layout:'layout'})})
router.post('/addUser',createUserForm)
router.post('/add',createUser)
router.get('/user/:id_user',editUser)
router.post('/user/:id_user/update',updateUser)
router.post('/user/:id_user/delete',deleteUser)

router.post('/addPermintaan',createCriticalPart)

router.get('/barang',getAllBarng)
router.get('/addBarang',AddBarang)
router.get('/barang/:material_master',editBarang)
router.post('/barang/:material_master/update',updateBarang)
router.post('/barang/:material_master/delete',deleteBarang)
router.post('/addBarang',createBarang)
router.post('/logout',logout)

router.get('/jenis',getAllJenis)
router.get('/addJenis',(req,res)=>{res.render('Jenis/addJenis')})
router.post('/addJenis',createJenis)
router.get('/jenis/:id_jenis',editJenis)
router.post('/jenis/:id_jenis/update',updateJenis)
router.post('/jenis/:id_jenis/delete',deleteJenis)

router.get('/kategori',getAllKategori)
router.get('/addKategori',(req,res)=>{res.render('Kategori/addKategori')})
router.post('/addKategori',createKategori)
router.get('/kategori/:id_kategori',editKategori)
router.post('/kategori/:id_kategori/update',updateKategori)
router.post('/kategori/:id_kategori/delete',deleteKategori)

router.get('/mrp',getAllMrp)
router.get('/addmrp',(req,res)=>{res.render('mrp/addMrp')})
router.post('/addmrp',createMrp)
router.get('/mrp/:id_mrp',editMrp)
router.post('/mrp/:id_mrp/update',updateMrp)
router.post('/mrp/:id_mrp/delete',deleteMrp)

router.get('/uom',getAllUOM)
router.get('/adduom',(req,res)=>{res.render('uom/addUom')})
router.post('/adduom',createUOM)
router.get('/uom/:id_uom',editUOM)
router.post('/uom/:id_uom/update',updateUOM)
router.post('/uom/:id_uom/delete',deleteUOM)

router.get('/plant',getAllPlant)
router.get('/addplant',(req,res)=>{res.render('plant/addplant')})
router.post('/addplant',createPlant)
router.get('/plant/:id_plant',editPlant)
router.post('/plant/:id_plant/update',updatePlant)
router.post('/plant/:id_plant/delete',deletePlant)


router.use(upload.single('excelFile'))
router.post('/excelUser', getUserTable);
router.post('/excelPermintaan',getPermintaanExcel),
router.post('/excelBarang',getExcelBarang)
module.exports = router;

