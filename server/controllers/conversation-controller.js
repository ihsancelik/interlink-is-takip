const express = require('express')
const router = express.Router()
const { Conversation, File } = require('../db')

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

//conversation list
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await Conversation.find()
        res.json(conversations)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Could not get conversations' })
    }
});

router.post('/conversations', upload.array('files'), async (req, res) => {
    try {
        const { name, task_id } = req.body
        const created_from_id = -1;
        const conversation = new Conversation({ task_id, name, created_from_id })

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
            conversation.files = savedFiles;
        }

        const savedConversation = await conversation.save()
        res.status(201).json(savedConversation)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Could not create conversation' })
    }
});


router.put('/conversations/:id', upload.array('files'), async (req, res) => {
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
        console.error(err)
        res.status(500).json({ message: 'Could not update conversation' })
    }
});



router.delete('/conversations/:id', async (req, res) => {
    try {
        const conversationId = req.params.id
        const deletedConversation = await Conversation.findByIdAndDelete(conversationId)
        if (!deletedConversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }
        res.json(deletedConversation)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Could not delete conversation' })
    }
});