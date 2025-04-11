const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        require: true,
        index: true
    },
    role: {
        type: String,
        require: true,
        index: true
    },
    status: {
        type: String,
        enum: ["Applied", "Interview", "Offer", "Rejected"],
        default: "Applied"
    },
    dateOfApplication: {
        type: Date,
        default: Date.now()
    },
    link: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("Job", JobSchema);