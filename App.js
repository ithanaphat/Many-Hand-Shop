require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000; 

mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true ,
    useUnifiedTopology :true
})

.then(() =>{
    console.log('Connected to MongoDB Atlas!');
})
.catch((err) => 
{
    console.error('Error connectring to MongoDB Atlas :',err);
})

app.use(express.json());

