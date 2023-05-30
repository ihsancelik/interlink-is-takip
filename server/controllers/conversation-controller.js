const express = require('express')
const router = express.Router()
const { Conversation, File, Task, User } = require('../db')
const { sendConversationAddedMessageMail } = require('../services/mailer')
const { addActivityLog } = require('../services/activity-log-service')
const { taskActivityAction } = require('../constants/activityActionConstants')
const { body, validationResult } = require('express-validator');
const { get_errors_string } = require('../helpers/error-handler')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//conversation list
router.get('/conversations/:taskId', async (req, res, next) => {
    try {
        const task_id = req.params.taskId;
        const conversations = await Conversation.find({ task: task_id })
            .populate('task')
            .populate('created_from')
            .populate('files')

        res.json(conversations)
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.post('/conversations/:taskId', [
    body('message').notEmpty().withMessage('Mesaj boş olamaz'),
    body('message').isLength({ min: 1, max: 1000 }).withMessage('Mesaj uzunluğu 1 ile 1000 arasında olmalıdır'),
], upload.array('files'), async (req, res, next) => {
    try {
        const task_id = req.params.taskId;
        const message = req.body.message
        const created_from = req.auth.user_id;

        const conversation = new Conversation({
            task: task_id,
            message: message,
            created_from: created_from,
        })

        if (req.files && req.files.length > 0) {
            const savedFiles = [];
            for (const file of req.files) {
                const { filename, originalname } = file;
                const savedFile = new File({
                    file_name: originalname,
                    virtual_file_name: filename,
                    created_from: created_from,
                });
                await savedFile.save();
                savedFiles.push(savedFile);
            }
            conversation.files = savedFiles;
        }

        const savedConversation = await conversation.save()

        const task = await Task.findById(task_id).populate('related_person');
        const conversationCreator = await User.findById(created_from);
        if (task.related_person._id != conversationCreator._id)
            sendConversationAddedMessageMail(task.related_person, conversationCreator, task.title);

        addActivityLog(created_from, task_id, taskActivityAction.COMMENT_ADDED, null, savedConversation._id);

        res.status(201).json(savedConversation)
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});


router.put('/conversations/:id', upload.array('files'), async (req, res, next) => {
    try {
        const conversationId = req.params.id
        const { name, task_id } = req.body
        const created_from_id = -1;

        let existingConversation = await Conversation.findById(conversationId);
        if (!existingConversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        if (name !== null)
            existingConversation.name = name;

        if (task_id !== null)
            existingConversation.task_id = task_id;

        if (req.files && req.files.length > 0) {
            const savedFiles = [];
            for (const file of req.files) {
                const { filename, originalname } = file;
                const savedFile = new File({
                    file_name: originalname,
                    virtual_file_name: filename,
                    created_from_id,
                });
                await savedFile.save();
                savedFiles.push(savedFile);
            }
            existingConversation.files.push(...savedFiles);
        }

        const updatedConversation = await existingConversation.save();
        res.json(updatedConversation)
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});



router.delete('/conversations/:id', async (req, res, next) => {
    try {
        const conversationId = req.params.id
        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        res.json(deletedConversation)
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});


module.exports = router;