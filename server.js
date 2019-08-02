
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const productRoutes = require('./backend/routes/product');
const userRoutes = require('./backend/routes/user');

const app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.use("/images", express.static(path.join("backend/images")));

mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true })
.then(() => {
  console.log('connect to DB ');
  
}).catch(() => {
  console.log("Connection Failed");
});

mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json()); 


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.use('/api/product', productRoutes);

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('hello Server running on localhost: 3000');
});

app.get('*', (req, res) => {
  res.send('Error 404 ...! Page Not Found');
});



app.listen(3000, function(){
    console.log("Server running on localhost:" + 3000);
});