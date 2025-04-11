const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    hash_password: {
        type: String,
        require: true
    },
    salt: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        versionKey: false
    })
UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.hashPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.pre("save", function (next) {
    if (
        this.isNew &&
        this.provider === "local" &&
        this.password &&
        !this.password.length
    )
        return next(new Error("Invalid password"));
    next();
});

UserSchema.methods.authenticate = function (plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
};

UserSchema.methods.makeSalt = function () {
    return crypto.randomBytes(16).toString("base64");
};

UserSchema.methods.hashPassword = function (password) {
    if (!password || !this.salt) return "";
    var salt = Buffer.from(this.salt, "base64");
    return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha1")
        .toString("base64");
};

UserSchema.methods.setPassword = function (password) {
    var thisSalt = this.makeSalt();
    if (!password || !thisSalt) return "";
    var salt = Buffer.from(thisSalt, "base64");
    return crypto
        .pbkdf2Sync(password, salt, 10000, 64, "sha1")
        .toString("base64");
};

UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.hashed_password;
    delete obj.salt;
    return obj;
};

module.exports = mongoose.model("User", UserSchema);