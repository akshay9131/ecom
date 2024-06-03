const { login, signUp, logout } = require('../../controller/auth');
const { getCart, addToCart, deleteFromCart, cartCount, updateCart } = require('../../controller/cart');
const { handlePayment, clearCart } = require('../../controller/payment');
const { getProduct, showProduct, singleProduct, searchProduct } = require('../../controller/product');
const { userLogin } = require('../../middleware');


const router = require('express').Router();
router.get('/', (req, res) => {
    res.render('home');
})

router.get('/signuppage', (req, res) => {
    res.render('signup')
})
router.post("/login",login)
router.post("/sign-up",signUp)
router.post("/payment", userLogin, handlePayment)
router.get("/add-cart",userLogin, addToCart)
router.get("/get-cart-count",userLogin, cartCount)
router.get("/update-cart", userLogin, updateCart)
// router.get("/get-product", getProduct)    // this api made for fetch fake data from and save in database
router.get("/product",userLogin, showProduct)
router.get('/logout', userLogin,  logout);
router.get('/single-product/:id', singleProduct);
router.get("/search-product", searchProduct)
router.get("/cart",userLogin, getCart)


router.get("/delete",userLogin, deleteFromCart)

router.get('/success', userLogin ,clearCart)

router.get('/cancel', (req, res) => {
    res.render('cancel');
})


module.exports = router;
