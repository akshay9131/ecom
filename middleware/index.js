const { generateToken } = require("../helper/utils");
const {User} = require('../models/index')


async function userLogin(req, res, next) {
    try {
        console.log("hello");
        let token = req.cookies?.token;
        console.log(req.cookies);
        if(!token) return res.json("access deninedd")
                console.log(token , ":::");
            const user = await User.findOne({
                where: {
                   token: token
                }
            })
            if(!user) return res.json("user not found")
            req._id = user.id
            req.email = user.email
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Auth failed',
            error: error
        });
    }
}

module.exports = {userLogin}