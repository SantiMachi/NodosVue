const { Router} =  require('express');
const router = Router();

const { getUsers, createUser, getUserById, deleteUser, deleteFix, updateUser, getEnlaces, createEnlace, getEnlaceById, deleteEnlace, updateEnlace} = require('../controllers/index.controller');

router.get('/users',getUsers);
router.get('/users/:id',getUserById);
router.post('/users',createUser);
router.delete('/users/:id',deleteUser);
router.delete('/users',deleteFix);
router.put('/users/:id',updateUser);
router.get('/enlaces',getEnlaces);
router.get('/enlaces/:id',getEnlaceById);
router.post('/enlaces',createEnlace);
router.delete('/enlaces/:id',deleteEnlace);
router.put('/enlaces/:id',updateEnlace);

module.exports = router;