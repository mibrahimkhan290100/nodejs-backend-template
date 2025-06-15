require('dotenv').config();
const bcrypt = require('bcrypt');


const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS , 10) || 10   ;

async function passwordHash(password) {
    return await bcrypt.hash(password , SALT_ROUNDS);
}

async function comparePassword(plainText , hashed) {
    return await bcrypt.compare(plainText , hashed);
}


module.exports = {passwordHash , comparePassword};