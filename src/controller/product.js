const { log } = require('console');
const { fetchProduct } = require('../service/helper/utils');
const { Product, Cart } = require('../models');
const { where } = require('sequelize');
const { Op } = require('sequelize');


module.exports = {

    // for create new product

    // getProduct: async(req, res) => {
    //     try {
    //         const productSchema = await fetchProduct();
    //         const saveProduct = await Product.bulkCreate(productSchema);
    //         return res.status(200).json({ message: "product add successfully", data:saveProduct });
    //     } catch (error) {
    //         console.log(error);
    //         return res.status(500).json({ error: error.message });;
    //     }
    // },


    // fetch trending product

    trendingProduct: async (req, res) => {
        try {
            const limit = 8;

            const { count, rows: products } = await Product.findAndCountAll({
                limit
            });

            const ccount = await Cart.count({ where: { user_id: req._id } });

            return res.render('product', {
                products,
                limit,
                ccount
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    // fetch all product 

    showProduct: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 8;
            const offset = (page - 1) * limit;


            const { count, rows: products } = await Product.findAndCountAll({
                limit,
                offset
            });


            const totalPages = Math.ceil(count / limit);
            const ccount = await Cart.count({ where: { user_id: req._id } })


            return res.render('all_product', {
                products,
                currentPage: page,
                totalPages,
                limit,
                ccount

            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    // search product

    searchProduct: async (req, res) => {
        try {
            const { name } = req.query;
            const filterConditions = {};


            if (name) {
                filterConditions.name = { [Op.like]: `%${name}%` };
            }

            const searchproducts = await Product.findAll({
                where: filterConditions
            });
            return res.render('search_product', { searchproducts });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    // fetch single product

    singleProduct: async (req, res) => {

        try {
            const productId = req.params.id;

            if (!productId) {
                return res.status(400).json({ error: "Product ID is required" });
            }

            const pro = await Product.findOne({
                where: { id: productId }
            })

            if (!pro) {
                return res.status(404).json({ error: "Product not found" });
            }

            return res.render('detail', { pro });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }

    }

}