const { generateToken } = require("../libs/jwt");
const Session = require("../models/session");
const User = require("../models/user");
const bcrypt = require('bcrypt');

const signup = async (req, res, next) => {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email, isDeleted: false })
    if (userExist) {
        return res.status(400).json({ message: 'User email is already exist' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        email,
        hash_password: hashedPassword,
    });
    await user.save();
    res.status(200).json({ message: 'User created successfully', user });
}

const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!password) {
        return res.status(400).json({ message: "Password cannot be empty" });
    }
    const userExist = await User.findOne({ email, isDeleted: false })
    if (!userExist) {
        return res.status(400).json({ message: "Your email is not valid" })
    }
    const isMatch = await bcrypt.compare(password, userExist.hash_password)
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const token = generateToken(userExist._id + new Date().getTime());
    const sessionDetails = new Session({
        token: token,
        expiresAt: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        user: userExist._id,
    })
    const tokenDetails = await sessionDetails.save();
    return res.status(200).json({ message: "Successfully login", email: userExist.email, token: tokenDetails.token });
}

module.exports = {
    signin, signup
}