const express = require("express")
const app = express();
const mongoose = require('mongoose');
const router = require("./router/index");
const tokenParser = require("./libs/tokenParser");
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGODBURL)
    .then(() => {
        console.log("connected");
    })
    .catch((err) => {
        console.error("not connected", err)
    })
    
app.use(cors());

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, x-access-token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
        return res.status(200).end();
    } else {
        next();
    }
});

app.use(bodyParser.json());
app.use(tokenParser());
app.use('/api', router);

app.listen(5000, () => {
    console.log('server is running on port 5000')
})