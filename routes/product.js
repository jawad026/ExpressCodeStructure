const express = require('express');

const {addTheProduct, getProducts} = require('../controller/product/productController')

const router = express.Router();

/* GET users listing. */

router.post('/add', addTheProduct);
router.get('/get', getProducts);

// Add the signup route

module.exports = router;
