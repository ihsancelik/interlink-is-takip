const Mongoose = require('mongoose');

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
    token: { type: String, required: false },
    department: { type: Mongoose.Schema.Types.ObjectId, ref: 'Department' },
    role: { type: Mongoose.Schema.Types.ObjectId, ref: 'UserRole' },
});

const userRoleSchema = new Mongoose.Schema({
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
    status: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskStatus' },
    priority: { type: Mongoose.Schema.Types.ObjectId, ref: 'TaskPriority' },
    created_from_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const conversationSchema = new Mongoose.Schema({
    message: { type: String, required: true },
    task_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Task' },
    files: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'File' }],
    created_from_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const fileSchema = new Mongoose.Schema({
    file_name: { type: String, required: true },
    virtual_file_name: { type: String, required: true },
    created_from_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now }
})

const activityLogSchema = new Mongoose.Schema({
    task_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'Task' },
    user_id: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
})

const Project = Mongoose.model('Project', projectSchema);
const Department = Mongoose.model('Department', departmentSchema);
const User = Mongoose.model('User', userSchema);
const UserRole = Mongoose.model('UserRole', userRoleSchema);
const Task = Mongoose.model('Task', taskSchema);
const TaskStatus = Mongoose.model('TaskStatus', taskStatusSchema);
const TaskPriority = Mongoose.model('TaskPriority', taskPrioritySchema);
const Conversation = Mongoose.model('Conversation', conversationSchema);
const File = Mongoose.model('File', fileSchema);
const ActivityLog = Mongoose.model('ActivityLog', activityLogSchema);

Mongoose.connect("mongodb://localhost:27017/istakipdb")
    .then(() => {
        console.log("MongoDB veritabanına bağlandı");
    })
    .catch((err) => {
        console.error("MongoDB bağlantı hatası:", err);
    });


checkStaticDatas();


async function checkStaticDatas() {
    const department = await Department.findOne({ name: "yazılım" });
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
            full_name: "admin",
            username: "admin",
            password: "admin",
            department: department._id,
            role: adminRole._id
        });
        await newUser.save();
    }

    const managerRole = await UserRole.findOne({ name: "yönetici" });
    const softwareManagerUser = await User.findOne({ username: "yazilim_yonetici" });
    if (!softwareManagerUser) {
        const newUser = new User({
            full_name: "yazilim_yonetici",
            username: "yazilim_yonetici",
            password: "yazilim_yonetici",
            department: department._id,
            role: managerRole._id
        });
        await newUser.save();
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
}

module.exports = {
    Project,
    Department,
    User,
    UserRole,
    Task,
    TaskStatus,
    TaskPriority,
    Conversation,
    File,
    ActivityLog
};