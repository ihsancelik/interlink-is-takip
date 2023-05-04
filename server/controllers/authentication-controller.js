const express = require('express');
const router = express.Router();
const { User } = require('../db');
const { generateToken } = require('../services/token-service');


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user = await User.findOne({ username: username, password: password });

        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const token = generateToken(user);
        user.token = token;
        const savedUser = await user.save();
        user = savedUser;

        user.password = undefined;
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not login user' });
    }
});


module.exports = router;