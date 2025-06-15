const { passwordHash, comparePassword } = require("../utils/configs/hash");
const { createToken } = require("../utils/configs/token");
const db = require("../utils/databases/db");
const { registerSchema, loginSchema } = require("../utils/validations/authValidator");
async function RegisterUser(req, res) {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      status: false,
      message: "Validation failed",
      error: error.details.map((d) => d.message),
    });
  }

  const { password, ...userData } = value;

  try {
    const existingUsers = await db('users').where({email : userData.email}).first();
    if(existingUsers){
        return res.status(409).json({
            status:false,
            message:"Email already exist"
        });
    }

    const password_hashed = await passwordHash(password);


    const [addUser] = await db('users').insert({

        password : password_hashed,
        ...userData
    });

    return res.status(201).json({
      status:true,
      data:{
        id:addUser,
        user:userData,
      },
      message:"New User Registered Successfully"
    })
  } catch (err) {
    return res.status(500).json({
      status:false,
      error:err,
      message:"Internal Server Error"
    })
  }
}

async function LoginUser(req , res) {
  const {error , value} = loginSchema.validate(req.body , {abortEarly:false});

  if(error){
    return res.status(400).json({
      status:false,
      message:"Vaildation failed",
      errors:error.details.map(d => d.message)
    })
  }

  const{password , email} = value

  try{

    const user = await db('users').where({email}).first();

    if(!user){
      return res.status(401).json({
        status:false,
        message:"User does Not exist"
      })
    }

    const isMatch = await comparePassword(password , user.password);

    if(!isMatch){
      return res.status(401).json({
        status:false,
        message:"Password incorrect"
      })
    }

    const token = await createToken({
      id:user.id,
      email:user.email
    });

    return res.status(200).json({
      status:true,
      data:{
        id:user.id,
        fullname:user.full_name,
        email:user.email,
      },
      token : token,
      message:"User Successfully login"
    })

  }catch(err){
    return res.status(500).json({
      status:false,
      errors:err,
      message:"Internal server error"
    })
  }
}

async function LogoutUser(req ,res) {
  
}
module.exports = { RegisterUser , LoginUser , LogoutUser };
