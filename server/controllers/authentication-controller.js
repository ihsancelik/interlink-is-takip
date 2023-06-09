const express = require('express');
const router = express.Router();
const { User, UserDevice, Department } = require('../db');
const { generateToken } = require('../services/token-service');
const { get_errors_string } = require('../helpers/error-handler')


router.post('/login', async (req, res, next) => {
    try {
        const { username, password, device_id } = req.body;
        let user = await User.findOne({ username: username, password: password }).populate('devices').populate('role');

        if (!user)
            return res.status(404).json({ message: 'Kullanıcı adı veya şifren yanlış' });

        if (!device_id)
            return res.status(400).json({ message: 'Bildirimlere izin vermeden sisteme giriş yapamazsın' });

        await UserDevice.deleteMany({ device_id: device_id });

        if (user.devices.filter(d => d.device_id === device_id).length < 1) {
            const userDevice = await (new UserDevice({ device_id: device_id, user: user._id })).save();
            user.devices.push(userDevice._id);
        }

        const department = await Department.findById(user.department);
        const token = generateToken(department._id, department.name, user._id, user.full_name, user.username);
        user.token = token;
        const savedUser = await user.save();
        user = savedUser;

        user.password = undefined;
        res.json(user);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});


module.exports = router;