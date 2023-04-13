const express = require('express');
const Product = require('../models/product.model');

const app = express.Router();

app.get('/', async (req, res) => {
    let query = {};
    const {category,  orderBy} = req.query;
    if(category) {
        query.category = category;
    }
    try {
        let products ;
        if(orderBy==='') {
         products = await Product.find(query);
        } else {
            products =await Product.find(query).sort({price : orderBy});
        }


        return res.status(200).send({
            products
        });
    } catch (error) {
        return res.status(400).send({
            message : 'Something went wrong',
            error : error.message
        });
    }
});




module.exports = app;