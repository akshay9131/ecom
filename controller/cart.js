
const { where } = require('sequelize');
const { Cart,User, Product } = require('../models')
module.exports = {
    getCart: async (req, res)=>{
        try {
            const result  =  await Cart.findAndCountAll({
                where: {user_id: req._id},
                include: [
                    {model: User},
                    {model: Product}
                ]
            })
            let totalPrice = 0;
            const cartItems = result.rows 
        await cartItems.forEach(item => {
            totalPrice += item.quantity * item.Product.price; 
        });

            return res.render('cart', {cartItems , totalPrice});
        } catch (error) {
            console.log(error);
        }
    },

    addToCart: async(req, res) => {
        try {
            const user_id = req._id;
            const product_id = req.query.product_id;

            const item = await Cart.findOne({where: {user_id, product_id}});
            if (item) {
                item.quantity += 1;
                await item.save();
                return res.redirect('/cart')
            }
            console.log(item);

          await Cart.create({
                user_id,
                product_id,
                quantity : 1
            })
            return res.status(200).json({ success: true, message: "Product added to cart successfully" });
        } catch (error) {
            console.log("Error + " , error);
            return res.status(500).json({ error: error.message });
        }
    },

    cartCount: async(req, res) => {
        try {
            const count = await Cart.count({ where: { user_id: req._id } });
            
            res.setHeader('Content-Type', 'text/plain');
            res.send(count.toString());
        } catch (error) {
            console.error("Error fetching cart count:", error);
            res.status(500).send("Error fetching cart count");
        }
    },

    updateCart: async(req, res) => {
        try {
            const user_id = req._id;
            const product_id = req.query.product_id;
            const action = req.query.action; 
    
            const cartItem = await Cart.findOne({ where: { user_id, product_id } });
            
            if (!cartItem) {
                return res.status(404).json({ message: "Item not found in cart" });
            }
    
            if (action === 'add') {
                cartItem.quantity++;
            } else if (action === 'subtract') {
                if (cartItem.quantity > 1) {
                    cartItem.quantity--;
                } else {
                    await Cart.destroy({ where: { user_id, product_id } });
                    return res.status(200).json({ success: true, message: "Product removed from cart" });
                }
            }
    
            await cartItem.save();
    
            const updatedCartData = await Cart.findAll({ where: { user_id } });
    
            return res.status(200).json({ success: true, message: "Cart updated successfully", cartData: updatedCartData });
        } catch (error) {
            console.error("Error updating cart:", error);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    deleteFromCart: async (req, res) => {
        try {
            const user_id = req._id;
            const product_id = req.query.product_id;

            const cartItem = await Cart.findOne({where: {user_id, product_id} });
            
            if (!cartItem) {
                return res.status(404).json({ message: "Item not found in cart" });
            }

            let deletedCartItem;

            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                deletedCartItem = await cartItem.save();
            } else {
                deletedCartItem = await Cart.destroy({where:{ user_id, product_id } });
            }
            if (!deletedCartItem) {
                return res.status(404).json({ message: "Item not found in the cart" });
            }
            return res.redirect('/cart')
            // return res.status(200).json({ message: "Successfully deleted from cart", data: deletedCartItem });
        } catch (error) {
            console.log("Error: ", error);
            return res.status(500).json({ error: error.message });
        }
    }
 }