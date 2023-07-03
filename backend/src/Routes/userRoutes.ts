import express from 'express';
import controller from '../Controllers/userController'

const router = express.Router();

router.put('/updateUser', (req, res) => {
    controller.updateUser(req, res)
});

router.get('/getUsers', (req, res, next) => {
    controller.getUsers(req, res)
});

router.get('/getUserById', (req, res, next) => {
    controller.getUserById(req, res)
});

router.get('/getUsernameById/:idUsuario',(req,res)=>{
    controller.getUsernameById(req,res)
});

router.get('/getPasswordById/:idUsuario',(req,res)=>{
    controller.getPasswordById(req,res)
});

router.get('/getUserCredentials/:idUsuario',(req,res)=>{
    controller.getUserCredentials(req,res)
});

export default router;
