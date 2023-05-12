const express = require('express');
const router = express.Router();
const path = require('path');
const { File } = require('../db');

router.get('/storage/:virtualFileName', async (req, res) => {
    try {
        const virtualFileName = req.params.virtualFileName;
        const file_name = (await File.findOne({ virtual_file_name: virtualFileName })).file_name
        const filePath = path.join(__dirname, '../uploads', virtualFileName);
        res.download(filePath, file_name);
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Could not get file' });
    }
});

module.exports = router;