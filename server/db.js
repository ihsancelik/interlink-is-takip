const Mongoose = require('mongoose');

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
    department: { type: Mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

const taskSchema = new Mongoose.Schema({
    title: { type: String, required: false },
    description: { type: String, required: false },
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

const Department = Mongoose.model('Department', departmentSchema);
const User = Mongoose.model('User', userSchema);
const Task = Mongoose.model('Task', taskSchema);
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
    let department = await Department.findOne({ name: "yazılım" });
    if (!department) {
        const newDepartment = new Department({
            name: "yazılım"
        });
        department = newDepartment.save();
    }

    const user = await User.findOne({ username: "admin" });
    if (!user) {
        const newUser = new User({
            full_name: "admin",
            username: "admin",
            password: "admin",
            department: department._id
        });
        newUser.save();
    }
}

module.exports = {
    Department,
    User,
    Task,
    Conversation,
    File,
    ActivityLog
};