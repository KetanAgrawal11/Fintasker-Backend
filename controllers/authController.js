const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'JWT_SECRET';

exports.register = async (req, res) => {
    try {
        const { name, dob, gender, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, dob, gender, email, phone, password: hashedPassword });
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    console.log('Invalid credentials');
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, SECRET_KEY);
        res.json({
            token,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                dob: user.dob
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.editProfile = async (req, res) => {
    try {
        const { name, age, gender, phone, email, dob } = req.body;
        const updateFields = {};
        if (name) updateFields.name = name;
        if (age) updateFields.age = age;
        if (gender) updateFields.gender = gender;
        if (phone) updateFields.phone = phone;
        if (email) updateFields.email = email;
        if (dob) updateFields.dob = dob;
        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        const { password, ...userWithoutPassword } = updatedUser._doc;
        res.json({ success: true, updatedUser: userWithoutPassword });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
