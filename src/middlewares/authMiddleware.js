const {verifyToken} = require('../utils/configs/token')


async function authMiddleware(req ,res , next) {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startswith('Bearer ')){
        return res.status(401).json({
            status:false,
            message:"Unauthorized token required"
        });
    }

    const token = authHeader.split('')[1];

    const user = verifyToken(token)

    if(!user){
        return res.status(401).json({
            status:false,
            message:"Unauthorized – invalid or expired token"
        })
    }

    req.user = user;

    next();

}