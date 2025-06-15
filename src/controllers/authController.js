const { passwordHash } = require("../utils/configs/hash");
const db = require("../utils/databases/db");
const { registerSchema } = require("../utils/validations/authValidator");
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

module.exports = { RegisterUser };
