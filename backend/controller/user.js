const User = require("../models/user");
const bcrypt = require('bcrypt');
const createUser = async (req, res, next) => {
    const { email, password } = req.body;

    const duplicateEmail = await User.findOne({ email, isDeleted: false });
    if (duplicateEmail) {
        return res.status(400).json({ message: "Email is already exist" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        hash_password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ message: 'User created successfully' });
}

const updateUser = async (req, res, next) => {
    const { email, password } = req.body;

    const duplicateEmail = User.findOne({ email, isDeleted: false });
    if (!duplicateEmail) {
        return res.status(400).json({ message: "User is not exist" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    User.findByIdAndUpdate({ _id: req.params.id }, { email, hash_password: hashedPassword })
        .then(() => {
            return res.status(200).json({ message: 'User created successfully' });

        })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}

const deleteUser = async (req, res, next) => {

    const userDetail = await User.findById({ _id: req.params.id, isDeleted: false })
    if (!userDetail) {
        return res.status(400).json({ message: "User is not exist" })
    }

    User.findByIdAndUpdate({ _id: req.params.id }, { isDeleted: true })
        .then(() => {
            return res.status(200).json({ message: 'User updated successfully' });

        })
        .catch((err) => {
            return res.status(400).json({ message: err.message })
        })
}

const allUser = async (req, res, next) => {
    const count = await User.countDocuments({ isDeleted: false });
    const list = await User.find({ isDeleted: false })
    if (list.length > 0) {
        return res.status(200).json({ count, list })
    } else {
        return res.status(200).json({ count: 0, list: [] })
    }
}

const getUserById = async (req, res, next) => {
    const userDetail = await User.findById({ _id: req.params.id, isDeleted: false })
    if (userDetail) {
        return res.status(200).json({ item: userDetail })
    } else {
        return res.status(400).json({ message: "Job detail not found" })
    }
}

module.exports = {
    createUser, updateUser, deleteUser, allUser, getUserById
}