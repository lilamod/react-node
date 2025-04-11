// Session Model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
    token: {
        type: String,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isDeleted: {
        type: Boolean,
        index: true,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lastActive: {
        type: Date,
        index: true
    }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Session', SessionSchema);