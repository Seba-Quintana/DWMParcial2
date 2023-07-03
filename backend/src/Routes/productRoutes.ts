import express from 'express';
import controller from '../Controllers/productController'

const router = express.Router();

router.get('/getAllProducts', (req, res, next) => {
    controller.getAllProducts(req,res);
});

router.get('/getProductById/:id', (req, res, next) => {
    controller.getProduct(req, res)
});


export default router;
