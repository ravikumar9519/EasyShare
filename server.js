const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());
//connecting to db
connectDB();


//cors
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['POST']
}));
  
//template engine
app.set('views',path.join(__dirname,'/views'));
app.set('view engine', 'ejs');


//Route
app.use('/api/files',require('./routes/files'));
app.use('/files',require('./routes/show.js'));
app.use('/files/download',require('./routes/download'));


app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
});