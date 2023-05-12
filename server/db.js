const Mongoose = require('mongoose');
const { getTaskActivityActions } = require('../constants/task-activity-action');

const projectSchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const departmentSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const userSchema = new Mongoose.Schema({
    full_name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gsm: { type: String, required: false, unique: false },
    token: { type: String, required: false },
    department: { type: Mongoose.Schema.Types.ObjectId, ref: 'Department' },
    role: { type: Mongoose.Schema.Types.ObjectId, ref: 'UserRole' }
});

const userRoleSchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
})

const taskTypeSchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
})

const taskStatusSchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const taskPrioritySchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

const taskSchema = new Mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: false },
    related_project: { type: Mongoose.Schema.Types.ObjectId, ref: 'Project' },
    related_person: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    related_department: { type: Mongoose.Schema.Types.ObjectId, ref: 'Department' },
    type: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskType' },
    status: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskStatus' },
    priority: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskPriority' },
    created_from: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const conversationSchema = new Mongoose.Schema({
    message: { type: String, required: true },
    task: { type: Mongoose.Schema.Types.ObjectId, ref: 'Task' },
    files: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'File' }],
    created_from: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const fileSchema = new Mongoose.Schema({
    file_name: { type: String, required: true },
    virtual_file_name: { type: String, required: true },
    created_from: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const taskActivityActionSchema = new Mongoose.Schema({
    name: { type: String, required: true, unique: true }
})

const taskActivityLogSchema = new Mongoose.Schema({
    user: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    task: { type: Mongoose.Schema.Types.ObjectId, ref: 'Task' },
    action: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskActivityAction' },
    action_message: { type: String, required: true },
    old_data: { type: String, required: false },
    created_at: { type: Date, default: Date.now }
})

const mailAccountSchema = new Mongoose.Schema({
    email: { type: String, required: true, unique: true },
    host: { type: String, required: true },
    port: { type: Number, required: true },
    secure: { type: Boolean, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
})

const Project = Mongoose.model('Project', projectSchema);
const Department = Mongoose.model('Department', departmentSchema);
const User = Mongoose.model('User', userSchema);
const UserRole = Mongoose.model('UserRole', userRoleSchema);
const Task = Mongoose.model('Task', taskSchema);
const TaskStatus = Mongoose.model('TaskStatus', taskStatusSchema);
const TaskPriority = Mongoose.model('TaskPriority', taskPrioritySchema);
const TaskType = Mongoose.model('TaskType', taskTypeSchema);
const Conversation = Mongoose.model('Conversation', conversationSchema);
const File = Mongoose.model('File', fileSchema);
const TaskActivityAction = Mongoose.model('TaskActivityActionSchema', taskActivityActionSchema);
const TaskActivityLog = Mongoose.model('TaskActivityLog', taskActivityLogSchema);
const MailAccount = Mongoose.model('MailAccount', mailAccountSchema);

Mongoose.connect("mongodb://localhost:27017/istakipdb")
    .then(() => {
        console.log("MongoDB veritabanına bağlandı");
    })
    .catch((err) => {
        console.error("MongoDB bağlantı hatası:", err);
    });


checkStaticDatas();


async function checkStaticDatas() {

    const projects = ["Akdeniz Chemson Plus", "Bizim Toptan Plus Satışçı", "Bizim Toptan Plus Müşteri", "BAT Plus"]
    const projectList = await Project.find();
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (!projectList.find(x => x.name == project)) {
            const newProject = await new Project({
                name: project
            }).save();
        }
    }


    let department = await Department.findOne({ name: "yazılım" });
    if (!department) {
        const newDepartment = new Department({
            name: "yazılım"
        });
        department = await newDepartment.save();
    }

    const userRoles = ["admin", "yönetici", "kullanıcı"];
    const userRoleList = await UserRole.find();
    for (let i = 0; i < userRoles.length; i++) {
        const role = userRoles[i];
        if (!userRoleList.find(x => x.name == role)) {
            const newUserRole = await new UserRole({
                name: role
            }).save();
            console.log(newUserRole);
        }
    }

    const adminRole = await UserRole.findOne({ name: "admin" });
    const adminUser = await User.findOne({ username: "admin" });
    if (!adminUser) {
        const newUser = new User({
            full_name: "John Wick",
            username: "admin",
            password: "admin",
            email: "admin@interlink.com.tr",
            phone: "5555555555",
            department: department._id,
            role: adminRole._id
        });
        await newUser.save();
    }

    const managerRole = await UserRole.findOne({ name: "yönetici" });
    const softwareManagerUser = await User.findOne({ username: "yusuf" });
    if (!softwareManagerUser) {
        const newUser = new User({
            full_name: "Yusuf Çağrı Doruk",
            username: "yusuf",
            password: "1234",
            email: "yusuf.doruk@interlink.com.tr",
            phone: "5321765550",
            department: department._id,
            role: managerRole._id
        });
        await newUser.save();
    }

    const defaultRole = await UserRole.findOne({ name: "kullanıcı" });
    const softwareUser = await User.findOne({ username: "ihsan" });
    if (!softwareUser) {
        const newUser = new User({
            full_name: "İhsan Ç.",
            username: "ihsan",
            password: "1234",
            email: "ihsan.celik@interlink.com.tr",
            phone: "5541204422",
            department: department._id,
            role: defaultRole._id
        });
        await newUser.save();
    }

    const defaultTaskTypes = ["istek", "öneri", "sistem hatası", "diğer"];
    const taskTypeList = await TaskType.find();
    for (let i = 0; i < defaultTaskTypes.length; i++) {
        const taskType = defaultTaskTypes[i];
        if (!taskTypeList.find(x => x.name == taskType)) {
            const newTaskType = new TaskType({
                name: taskType
            });
            await newTaskType.save();
        }
    }

    const defaultStatusList = ["beklemede", "devam ediyor", "tamamlandı", "iptal edildi"];
    const taskStatusList = await TaskStatus.find();
    for (let i = 0; i < defaultStatusList.length; i++) {
        const status = defaultStatusList[i];
        if (!taskStatusList.find(x => x.name == status)) {
            const newTaskStatus = new TaskStatus({
                name: status
            });
            await newTaskStatus.save();
        }
    }

    const priorityList = ["normal", "yüksek", "kritik"];
    const taskPriorityList = await TaskPriority.find();
    for (let i = 0; i < priorityList.length; i++) {
        const priority = priorityList[i];
        if (!taskPriorityList.find(x => x.name == priority)) {
            const newTaskPriority = new TaskPriority({
                name: priority
            });
            await newTaskPriority.save();
        }
    }

    const taskActivityActionList = getTaskActivityActions();
    const taskActivityActionListDb = await TaskActivityAction.find();
    for (let i = 0; i < taskActivityActionList.length; i++) {
        const action = taskActivityActionList[i];
        if (!taskActivityActionListDb.find(x => x.name == action)) {
            const newTaskActivityAction = new TaskActivityAction({
                name: action
            });
            await newTaskActivityAction.save();
        }
    }
}

module.exports = {
    Project,
    Department,
    User,
    UserRole,
    Task,
    TaskStatus,
    TaskPriority,
    TaskType,
    Conversation,
    File,
    TaskActivityAction,
    TaskActivityLog,
    MailAccount
};