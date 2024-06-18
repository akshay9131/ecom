const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const comparePass = async (currtPass, userPass) => {
    try {
        const match = await bcrypt.compare(currtPass, userPass);
        return match;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const hashPass = async (pass) => {
    try {
        const hash = await bcrypt.hash(pass, 10)
        return hash;
    } catch (error) {
        throw new Error('Error Hasing  passwords');
    }
};


const generateToken = (user) => {
    try {
        const token = jwt.sign(
            {
                email: user.email,
                userId: user.id
            },
            "fdgfghghdgdddgh",
            {
                expiresIn: "2h"
            }
        );
        return token;
    } catch (error) {
        throw new Error('Error generating token');
    }
};

const fetchProduct = async () => {
    try {
      const response = await axios.get('https://freetestapi.com/api/v1/products');
      return response.data;
    } catch (error) {
      return null;
    }
  };

module.exports = { comparePass, generateToken , hashPass, fetchProduct }