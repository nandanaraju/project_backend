require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    try {
        const { username, password, email, usertype } = req.body;
        if (!username || !password || !email || !usertype) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email, usertype });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed - User doesn\'t exist' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed - Password doesn\'t match' });
        }

        const token = jwt.sign(
            { userId: user._id, usertype: user.usertype, email: user.email }, // Ensure email is included
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('Authtoken', token);
        res.json({
            status: true,
            message: 'Login successful',
            token,
            usertype: user.usertype
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed' });
    }
});



router.get('/logout', (req, res) => {
    res.clearCookie('Authtoken');
    res.status(200).send('Logout successful');
});

module.exports = router;
