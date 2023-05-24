const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeNotificationWebSocketServer } = require('./services/notificationHub')

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
const userRoleController = require('./controllers/user-role-controller');
const taskController = require('./controllers/task-controller');
const taskStatusController = require('./controllers/task-status-controller');
const taskTypeController = require('./controllers/task-type-controller');
const taskPriorityController = require('./controllers/task-priority-controller');
const conversationController = require('./controllers/conversation-controller');
const projectController = require('./controllers/project-controller');
const storageController = require('./controllers/storage-controller');

//Authorization
const config = require('./config.json');
const { expressjwt } = require('express-jwt');
app.use(expressjwt({ secret: config.jwt['secret-key'], algorithms: ["HS256"] })
    .unless(
        { path: ["/login"] }
    ));

// Controllers
app.use(authenticationController);
app.use(departmentController);
app.use(userController);
app.use(userRoleController);
app.use(taskController);
app.use(taskStatusController);
app.use(taskTypeController);
app.use(taskPriorityController);
app.use(conversationController);
app.use(projectController);
app.use(storageController);


const { logErrorMiddleware } = require('./middlewares/exception-logger-middleware');
app.use(logErrorMiddleware);


// start the https server. ca.crt and ca.key files are required on config folder for https
// const https = require('https');
// const privateKey = fs.readFileSync(__dirname + '/config/cert.key', 'utf8');
// const certificate = fs.readFileSync(__dirname + '/config/cert.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };
// const server = https.createServer(credentials, app);
// server.listen(3000, () => { console.log('Server running on port 3000'); });

const server = app.listen(3000, () => { console.log('Server running on port 3000'); });
initializeNotificationWebSocketServer(server);