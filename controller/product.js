const { log } = require('console');
const { fetchProduct } = require('../helper/utils');
const { Product, Cart } = require('../models');
const { where } = require('sequelize');
const { Op } = require('sequelize');


module.exports = {

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
            const ccount = await Cart.count({where:{user_id:req._id}})
    

            return res.render('product', {
                products,
                currentPage: page,
                totalPages,
                limit,
                ccount

            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    searchProduct : async (req, res) => {
        try {
            const { name } = req.query;
            const filterConditions = {};
    

            if (name) {
                filterConditions.name = { [Op.like]: `%${name}%` };
            }
    
            const products = await Product.findAll({
                where: filterConditions
            });
            // return res.status(200).json({ message: "sucessfully fetch", data: products })
            return res.render('search_product', { products });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    },

    singleProduct : async (req, res) => {

        try {
            console.log("jejoeojeijie");
            const productId = req.params.id;
            console.log(`Fetching product with ID: ${productId}`);

            if (!productId) {
                return res.status(400).json({ error: "Product ID is required" });
            }

        const pro = await Product.findOne({
            where: {id: productId}
        })

        if (!pro) {
            console.log(`Product with ID: ${productId} not found`);
            return res.status(404).json({ error: "Product not found" });
        }

        console.log(`Product with ID: ${productId} found:`, pro);
        return res.render('detail', { pro });
        // return res.status(200).json({ message: "sucessfully fetch", data: pro })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }

    }   

}