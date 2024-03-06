var express = require('express');
const { getAllUnit, formUnit, createUnit, deleteUnit, editUnit } = require('../controllers/UnitController');
const { getAllUsers, createUser, editUser, createUserForm, deleteUser, updateUser } = require('../controllers/UserController');
const { getUserTable, getCriticalPart, getTableBody, test } = require('../controllers/CriticalPartController');
const { getDetailPermintaan, getPermintaanExcel, createCriticalPart } = require('../controllers/DetailCriticalPartController');
const multer = require('multer');
const { getAllBarng, getExcelBarang, AddBarang, createBarang, editBarang, updateBarang, deleteBarang } = require('../controllers/BarangController');
const { formLogin, login, logout } = require('../controllers/AuthController');
const { authenticateToken } = require('../controllers/middleware');
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

router.get('/user',getAllUsers)
router.get('/addUser',(req,res)=>{res.render('./User/addUser',{ layout:'layout'})})
router.post('/addUser',createUserForm)
router.post('/add',createUser)
router.get('/user/:id_user',editUser)
router.post('/user/:id_user/update',updateUser)
router.post('/user/:id_user/delete',deleteUser)

router.post('/addPermintaan',createCriticalPart)
router.get('/test',test)

router.get('/barang',getAllBarng)
router.get('/addBarang',AddBarang)
router.get('/barang/:material_master',editBarang)
router.post('/barang/:material_master/update',updateBarang)
router.post('/barang/:material_master/delete',deleteBarang)
router.post('/addBarang',createBarang)
router.post('/logout',logout)




router.use(upload.single('excelFile'))
router.post('/excelUser', getUserTable);
router.post('/excelPermintaan',getPermintaanExcel),
router.post('/excelBarang',getExcelBarang)
module.exports = router;

