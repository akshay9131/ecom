const Joi = require('joi');
const { comparePass, generateToken, hashPass } = require('../helper/utils');
const { User } = require('../models')

module.exports = {
    login: async (req, res) => {
        try {
            const userSchema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            });

            const { error, value } = userSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            let user = await User.findOne({
                where: {
                    email: req.body.email
                }
            });
            if (!user) return res.status(400).json({ error: "Email not found" })

            const isPass = await comparePass(value.password, user.password);
            if (!isPass) return res.status(400).json({ error: "Password not match" });

            const token =  generateToken(user);
            console.log(token);
            user.token = token
            await user.save()
            res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 });
            // return res.redirect('/product');
            return res.json({ success: true });
            // return res.status(200).json({ message: "sucessfully login", data: user })
        } catch (error) {
            console.log("Error + " , error);
            return res.status(500).json({ error: error.message });
        }
    },
    signUp: async (req, res) => {
        try {
            const userSchema = Joi.object({
                name:Joi.string().required(),
                email: Joi.string().email().required(),
                gender: Joi.string().required(),
                mobile: Joi.string().required(),
                password: Joi.string().required(),
            });

            const { error, value } = userSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            let user = await User.findOne({
                where: {
                    email: req.body.email
                }
            });

            if (user) return res.status(400).json({ error: "Email Alredy in use" })
            
            const hash = await hashPass(value.password);
            value.password = hash
            let newUser = await User.create(value);
            // return res.redirect("/");
            return res.json({ success: true });
            // return res.status(200).json({ message: "sucessfully register suvvefully", data: newUser })
        } catch (error) {
            console.log("Error + " , error);
            return res.status(500).json({ error: error.message });
        }
    },
    logout:async (req, res) => {
        try {
           
            const user = await User.findOne({
                where: {
                    email: req.email,
                    id: req._id 
                }
            })
    
            user.token = null
            res.clearCookie('token');
            await user.save()
            return res.redirect('/')
            // return res.status(200).json({ message: "logout successfully"})
        } catch (error) {
            console.log("error", error);
            res.send(error)
        }
    }
}

//stripe test key

// sk_test_51PKJKxSG9CGXHbquQgesTIN8g5Pcf8aNMOHDVQqSq1pTzkNs2CtfHFbn9pkFeg3zzkFK2Yv4v8ytKZHHPuyrX6f60067a1mFLn 


// validation on form

// if there is no data so it should be showing no data found

// use ajax for form submission and add to cart and add more in cart

// use e-commerce templete5