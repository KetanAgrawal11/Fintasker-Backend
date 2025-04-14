const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true }); // Enables createdAt and updatedAt

const User = mongoose.model('User', UserSchema);

module.exports = User;