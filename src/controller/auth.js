const Joi = require('joi');
const { comparePass, generateToken, hashPass } = require('../service/helper/utils');
const { User } = require('../models')

module.exports = {

    // login

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

            const token = generateToken(user);
            user.token = token
            await user.save()
            res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000 });


            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },


    // signup


    signUp: async (req, res) => {
        try {
            const userSchema = Joi.object({
                name: Joi.string().required(),
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


            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },



    // logout
    logout: async (req, res) => {
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
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
