const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute')

app.use(express.json());

app.use('/auth' , authRoute);

app.use('/' , (req , res) =>{
    res.send("Api is now Functional");
})


module.exports = app