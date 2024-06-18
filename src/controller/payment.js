const stripe = require('stripe')("sk_test_51PKJKxSG9CGXHbquQgesTIN8g5Pcf8aNMOHDVQqSq1pTzkNs2CtfHFbn9pkFeg3zzkFK2Yv4v8ytKZHHPuyrX6f60067a1mFLn");
const { where } = require('sequelize');
const { Payment , Cart, User, Product} = require('../models');

module.exports = {

  // stripe payment gateway

  handlePayment: async (req, res) => {
      try {
        const userId = req._id;
        const cartItems = await Cart.findAll({
                where: { user_id: userId },
                include: [Product]
              });
    
              let totalAmount = 0;
                  cartItems.forEach(item => {
                    totalAmount += item.Product.price * item.quantity;
                  });


        const lineItems = cartItems.map((item)=>({
            price_data:{
                currency:"AED",
                product_data: {
                              name: item.Product.name,
                            },
                unit_amount:item.Product.price * 100,
            },
            quantity:item.quantity,
        }));
    
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:"http://localhost:3000/success",
            cancel_url:"http://localhost:3000/cancel",
        });
    
        res.json({id:session.id});
      
    } catch (error) {
          res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
    }
  },

  // clear cart after payment successful

  clearCart: async  (req, res) => {
    try {
      
      await Cart.destroy({
        where : {user_id: req._id},
    })
    return res.render("success")
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the checkout session.' });
    }
}

}