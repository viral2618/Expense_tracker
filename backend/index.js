const express =require('express')
const app = express();
const AuthRouter =require('./Routes/AuthRouter')
const ProductRouter =require('./Routes/ProductRouter')
const cors = require('cors')
const bodyParser= require('body-parser');
const { config } = require('dotenv');
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
    res.send('pong')
});


app.use(bodyParser.json());
app.use(cors())
app.use('/auth',AuthRouter);
app.use('/products',ProductRouter)
app.listen(PORT,()=>(
    console.log(`server is running ${PORT}`)
))