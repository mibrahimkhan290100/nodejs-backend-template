const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

async function createToken(payload, expiresIn = "1h") {
  return jwt.sign(payload , JWT_SECRET , {expiresIn});
}

async function verifyToken(token) {
    try{
        return jwt.verify(token , JWT_SECRET);

    }catch(err){
        return null;
    }
}

module.exports= {
    createToken
    verifyToken
}