const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/uploads'));

// if not exist __dirname + '/uploads' folder, create it'
const fs = require('fs');
if (!fs.existsSync(__dirname + '/uploads')) fs.mkdirSync(__dirname + '/uploads');

const authenticationController = require('./controllers/authentication-controller');
const departmentController = require('./controllers/department-controller');
const userController = require('./controllers/user-controller');

//Authorization
const config = require('./config.json');
const { expressjwt } = require('express-jwt');
app.use(expressjwt({ secret: config.jwt['secret-key'], algorithms: ["HS256"] }).unless({ path: ["/login"] }));

// Controllers
app.use(authenticationController);
app.use(departmentController);
app.use(userController);


app.listen(3000, () => { console.log('Server running on port 3000'); });